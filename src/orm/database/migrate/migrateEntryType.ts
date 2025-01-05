import type { Database, DatabaseConfig } from "#orm/database/database.ts";
import type {
  ChildListDefinition,
  EasyField,
  EntryType as EntryTypeDef,
} from "@vef/types";
import { EasyOrm } from "#orm/orm.ts";
import { fieldTypeMap } from "#orm/entry/field/fieldTypeMap.ts";
import { generateId } from "#orm/utils/misc.ts";

const idField: EasyField = {
  key: "id",
  fieldType: "IDField",
  primaryKey: true,
};
const baseFields: EasyField[] = [
  {
    key: "createdAt",
    fieldType: "TimeStampField",
  },
  {
    key: "updatedAt",
    fieldType: "TimeStampField",
  },
];

export async function syncEntryTypesToDatabase({
  orm,
  entryTypes,
  onOutput,
}: {
  orm: EasyOrm;
  entryTypes: EntryTypeDef[];
  onOutput?: (message: string) => void;
}) {
  await orm.database.deleteRows("entryType");
  await orm.database.deleteRows("childEntryTypeFields");
  for (const entryType of entryTypes) {
    const config = entryType.config as any;
    console.log("Creating entry type", entryType.entryType);
    const newEntry = await orm.database.insertRow("entryType", {
      id: entryType.entryType,
      entryType: entryType.entryType,
      ...config,
      idMethod: config.type,
      // fields: entryType.fields,
    });
    const fields = entryType.fields.map((f) => ({
      id: generateId(16),
      parentId: entryType.entryType,
      key: f.key,
      label: f.label,
      fieldType: f.fieldType,
      description: f.description || "",
      required: f.required || false,
    }));
    for (const field of fields) {
      await orm.database.insertRow("childEntryTypeFields", field);
    }
    // console.log(entryType.fields.map((f) => f.key));
  }
}

export async function migrateEntryType(options: {
  database: Database<keyof DatabaseConfig>;
  entryType: EntryTypeDef;
  onOutput?: (message: string) => void;
}) {
  const { database, entryType } = options;

  const onOutput = options.onOutput || console.log;
  const tableName = entryType.config.tableName;
  // Check if the table exists
  const tableExists = await database.adapter.tableExists(tableName);

  // If the table does not exist, create it

  const primaryField = entryType.fields.find((f) => f.primaryKey) || idField;
  if (!tableExists) {
    await database.adapter.createTable(
      tableName,
      primaryField,
      entryType.config.idMethod,
    );
    onOutput(`Created table: ${tableName}`);
  } else {
    onOutput(`Table ${tableName} already exists`);
  }
  const fields = entryType.fields.filter((f) =>
    f.fieldType !== "MultiChoiceField"
  );

  const multiChoiceFields = entryType.fields.filter((f) =>
    f.fieldType === "MultiChoiceField"
  );

  await syncFields(database, tableName, [
    ...baseFields,
    primaryField,
    ...fields,
  ], onOutput);

  for (const field of multiChoiceFields) {
    await migrateMultiChoiceField(database, entryType, field, onOutput);
  }

  for (const child of entryType.children) {
    await migrateChild(database, child, entryType, onOutput);
  }
  await database.adapter.vacuumAnalyze(entryType.config.tableName);
}

async function migrateMultiChoiceField(
  database: Database<keyof DatabaseConfig>,
  parent: EntryTypeDef,
  field: EasyField,
  onOutput: (message: string) => void,
) {
  const valuesTableName = `${parent.entryType}_${field.key}_mc_values`;

  const valuesTableExists = await database.adapter.tableExists(valuesTableName);

  if (!valuesTableExists) {
    await database.adapter.createTable(valuesTableName, {
      key: "id",
      fieldType: "IDField",
      primaryKey: true,
    }, {
      type: "hash",
      hashLength: 16,
    });
  }

  await syncFields(database, valuesTableName, [
    {
      key: "parentId",
      fieldType: parent.config.idMethod.type === "number"
        ? "IntField"
        : "DataField",
    },
    {
      key: "value",
      fieldType: "DataField",
    },
    {
      key: "order",
      fieldType: "IntField",
    },
  ], onOutput);
  await database.adapter.createIndex({
    tableName: valuesTableName,
    indexName: `${valuesTableName}_parentId`,
    columns: "parentId",
    include: ["value"],
  });

  await database.adapter.vacuumAnalyze(valuesTableName);
}
async function migrateChild(
  database: Database<keyof DatabaseConfig>,
  child: ChildListDefinition,
  parent: EntryTypeDef,
  onOutput?: (message: string) => void,
) {
  onOutput = onOutput || console.log;
  const tableName = child.config!.tableName;
  // Check if the table exists
  const tableExists = await database.adapter.tableExists(tableName);
  if (!tableExists) {
    await database.adapter.createTable(tableName, idField, {
      type: "hash",
      hashLength: 16,
    });
  }
  const parentIdType = parent.config.idMethod.type === "number"
    ? "IntField"
    : "DataField";
  const baseChildFields: EasyField[] = [{
    key: "parentId",
    fieldType: parentIdType,
    description: "The id of the parent record",
  }, {
    key: "order",
    fieldType: "IntField",
    description: "The sort order of the child row",
  }];

  await syncFields(database, tableName, baseChildFields, onOutput);

  await syncFields(database, tableName, child.fields, onOutput);
}

async function syncFields(
  database: Database<keyof DatabaseConfig>,
  tableName: string,
  fields: EasyField[],
  onOutput: (message: string) => void,
) {
  const existingColumns = await database.adapter.getTableColumns(tableName);

  const fieldsToCreate: EasyField[] = [];

  // Check if the base fields exist
  for (const field of fields) {
    const columnExists = existingColumns.find((c) => c.name === field.key);
    if (!columnExists) {
      fieldsToCreate.push(field);
    }
  }

  // Create the missing columns
  for (const field of fieldsToCreate) {
    if (field.fieldType === "ConnectionField") {
      field.fieldType = field.connectionIdType!;
    }
    await database.adapter.addColumn(tableName, field);
  }
  if (fieldsToCreate.length > 0) {
    onOutput(`Created columns: ${fieldsToCreate.map((f) => f.key).join(", ")}`);
  } else {
    onOutput(`All columns exist`);
  }
}
