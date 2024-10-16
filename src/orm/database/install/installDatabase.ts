import type { Database, DatabaseConfig } from "#orm/database/database.ts";
import type { EasyField } from "@vef/types";

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
      key: "settingsId",
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
  if (exists) {
    return;
  }
  await database.adapter.createTable(tableName, {
    key: "id",
    fieldType: "DataField",
    primaryKey: true,
  }, {
    type: "data",
  });

  for (const field of fields) {
    await database.adapter.addColumn(tableName, field);
  }
}
