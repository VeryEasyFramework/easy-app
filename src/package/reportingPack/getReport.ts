import type { EasyOrm } from "#orm/orm.ts";
import type { ReportOptions } from "#orm/reports.ts";
import type { User } from "@vef/types";
import {
  DatabaseReportColumn,
  DatabaseReportOptions,
} from "#orm/database/database.ts";
import { raiseOrmException } from "#orm/ormException.ts";
import { fieldTypeMap } from "#orm/entry/field/fieldTypeMap.ts";

export async function getReport(
  orm: EasyOrm,
  entryType: string,
  options: ReportOptions,
  user?: User,
) {
  const { database } = orm;
  const entryTypeDef = orm.getEntryType(entryType);
  const columns = new Set(
    options.columns ??
      ["id"],
  );
  if (entryTypeDef.config.titleField) {
    columns.add(entryTypeDef.config.titleField);
  }
  let subGroupLabel = options.subGroup;
  if (options.subGroup) {
    const subGroupField = entryTypeDef.fields.find(
      (field) => field.key === options.subGroup,
    );
    if (!subGroupField) {
      raiseOrmException(
        "InvalidField",
        `Field ${options.subGroup} not found in ${entryType}`,
      );
    }
    if (
      subGroupField.fieldType === "ConnectionField" &&
      subGroupField.connectionTitleField
    ) {
      subGroupLabel = subGroupField.connectionTitleField;
    }
    columns.add(options.subGroup);
  }
  const connectionFields = entryTypeDef.fields.filter((field) =>
    field.fieldType === "ConnectionField" && columns.has(field.key) &&
    field.connectionTitleField
  );

  for (const field of connectionFields) {
    columns.add(field.connectionTitleField!);
  }
  const tableName = entryTypeDef.config.tableName;
  const report: DatabaseReportOptions = {
    columns: Array.from(columns),
    subGroup: options.subGroup,
    filter: options.filter ?? {},
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
    orderBy: options.orderBy,
    order: options.order,
  };

  if (options.join) {
    const joinEntryType = orm.getEntryType(options.join.entryType);
    const joinConnection = entryTypeDef.connections.find((c) =>
      c.entryType === options.join?.entryType
    );
    if (!joinConnection) {
      raiseOrmException(
        "EntryTypeNotFound",
        `EntryType ${options.join.entryType} is not a valid connection for ${entryType}`,
      );
    }

    const joinFields = joinEntryType.fields.filter((field) =>
      options.join?.columns.includes(field.key)
    );
    const joinColumns = joinFields.map((field) => {
      const column: DatabaseReportColumn = {
        name: field.key,
      };
      switch (field.fieldType) {
        case "BigIntField":
        case "IntField":
        case "DecimalField":
          column.aggregate = "sum";
          column.alias = `${field.key}Sum`;
          break;
      }
      return column;
    });

    report.joinTable = {
      tableName: joinEntryType.config.tableName,
      type: options.join.type,
      columns: joinColumns,
      joinColumn: joinConnection.idFieldKey,
    };
  }
  const results = await database.getReport(tableName, report);

  if (!options.subGroup) {
    return results;
  }
  const groupedResults = new Map();

  for (const row of results.data) {
    const key = row[subGroupLabel || options.subGroup];
    if (!groupedResults.has(key)) {
      groupedResults.set(key, []);
    }
    groupedResults.get(key).push(row);
  }
  return {
    columns: results.columns,
    rowCount: results.rowCount,
    totalCount: results.totalCount,
    data: Object.fromEntries(groupedResults),
  };
}
