import type { EasyOrm } from "#orm/orm.ts";
import type { ReportOptions, ReportResult } from "#orm/reports.ts";
import type { RowsResult, User } from "@vef/types";
import {
  DatabaseReportColumn,
  DatabaseReportOptions,
} from "#orm/database/database.ts";
import { raiseOrmException } from "#orm/ormException.ts";
import { easyLog } from "#/log/logging.ts";

export async function getReport(
  orm: EasyOrm,
  entryType: string,
  options: ReportOptions,
  user?: User,
): Promise<ReportResult> {
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
  const reportColumns: DatabaseReportOptions["columns"] = [];

  if (options.groupBy) {
    const sumFields = entryTypeDef.fields.filter((field) =>
      ["BigIntField", "IntField", "CurrencyField", "DecimalField"].includes(
        field.fieldType,
      ) && columns.has(field.key)
    ).map((f) => f.key);
    const sumColumns: DatabaseReportColumn[] = [];
    for (const field of sumFields) {
      sumColumns.push({
        name: field,
        aggregate: "sum",
      });
      columns.delete(field);
    }

    reportColumns.push(...sumColumns);
  }
  reportColumns.push(...Array.from(columns));
  const tableName = entryTypeDef.config.tableName;
  const report: DatabaseReportOptions = {
    columns: reportColumns,
    subGroup: options.subGroup,
    filter: options.filter ?? {},
    orFilter: options.orFilter,
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
    orderBy: options.orderBy,
    order: options.order,
    groupBy: options.groupBy,
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
        case "CurrencyField":
        case "DecimalField":
          column.aggregate = "sum";
          column.alias = `${field.key}`;

          break;
      }
      return column;
    });

    report.joinTable = {
      tableName: joinEntryType.config.tableName,
      type: options.join.type,
      columns: joinColumns,
      joinColumn: joinConnection.idFieldKey,
      filter: options.join.filter,
    };
  }
  const results: RowsResult<Record<string, any>> & { totals?: any } =
    await database.getReport(tableName, report);

  // for totals

  if (options.withTotals) {
    // const totalsColumns = reportColumns.map((column) => {
    //   if (typeof column === "string") {
    //     return {
    //       name: column,
    //       asNull: true,
    //     };
    //   }
    //   if ("aggregate" in column) {
    //     return column;
    //   }
    //   if ("type" in column) {
    //     return {
    //       name: column.key,
    //       asNull: true,
    //     };
    //   }
    //   if ("name" in column) {
    //     return {
    //       name: column,
    //       asNull: true,
    //     };
    //   }
    // }) as DatabaseReportColumn[] ?? [];
    const totalsColumns = reportColumns.filter((column) =>
      typeof column === "object" && "aggregate" in column
    );
    const reportTotals: DatabaseReportOptions = {
      columns: totalsColumns,
      filter: options.filter ?? {},
      orFilter: options.orFilter,
      groupBy: options.groupBy,
      forTotals: true,
    };
    if (report.joinTable) {
      reportTotals.joinTable = {
        tableName: report.joinTable.tableName,
        type: report.joinTable.type,
        columns: report.joinTable.columns.filter((column) => column.aggregate),
        joinColumn: report.joinTable.joinColumn,
        filter: report.joinTable.filter,
      };
    }
    const totals = await database.getReport(tableName, reportTotals);
    results.totals = totals.data[0];
    // end for totals
  }

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
