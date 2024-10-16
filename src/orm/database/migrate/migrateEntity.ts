import type { Database, DatabaseConfig } from "#orm/database/database.ts";
import type {
  ChildListDefinition,
  EasyField,
  EntityDefinition,
} from "@vef/types";

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
export async function migrateEntity(options: {
  database: Database<keyof DatabaseConfig>;
  entity: EntityDefinition;
  onOutput?: (message: string) => void;
}) {
  const { database, entity } = options;

  const onOutput = options.onOutput || console.log;
  const tableName = entity.config.tableName;
  // Check if the table exists
  const tableExists = await database.adapter.tableExists(tableName);

  // If the table does not exist, create it

  const primaryField = entity.fields.find((f) => f.primaryKey) || idField;
  if (!tableExists) {
    await database.adapter.createTable(
      tableName,
      primaryField,
      entity.config.idMethod,
    );
    onOutput(`Created table: ${tableName}`);
  } else {
    onOutput(`Table ${tableName} already exists`);
  }

  await syncFields(database, tableName, [
    ...baseFields,
    primaryField,
    ...entity.fields,
  ], onOutput);

  entity.children.forEach((child) => {
    migrateChild(database, child, entity);
  });
}

async function migrateChild(
  database: Database<keyof DatabaseConfig>,
  child: ChildListDefinition,
  parent: EntityDefinition,
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
