import type { Database, DatabaseConfig } from "#orm/database/database.ts";
import type { EasyField } from "#/vef-types/mod.ts";

export async function installDatabase(options: {
  database: Database<keyof DatabaseConfig>;
}) {
  const { database } = options;
  await createSettingsTable(database);
}

async function createSettingsTable(database: Database<any>) {
  const tableName = "easy_settings";
  const fields: EasyField[] = [
    {
      key: "settingsType",
      fieldType: "DataField",
    },
    {
      key: "key",
      fieldType: "DataField",
    },
    {
      key: "value",
      fieldType: "JSONField",
    },
  ];
  const exists = await database.adapter.tableExists(tableName);
  if (!exists) {
    await database.adapter.createTable(tableName, {
      key: "id",
      fieldType: "DataField",
      primaryKey: true,
    }, {
      type: "data",
    });
  }
  const existingColumns = await database.adapter.getTableColumns(tableName);
  for (const field of fields) {
    const existingColumn = existingColumns.find((column) =>
      column.name === field.key
    );

    if (existingColumn) {
      continue;
    }

    await database.adapter.addColumn(tableName, field);
  }
}
