import type { Database } from "#orm/database/database.ts";
import type { SettingsType } from "#orm/entry/settings/settingsType.ts";
import { OrmException } from "#orm/ormException.ts";
import type { EasyField } from "@vef/types";
import { validateField } from "#orm/entry/field/validateField.ts";

export async function migrateSettingsType(options: {
  database: Database<any>;
  settingsType: SettingsType;
  onOutput?: (message: string) => void;
}) {
  const { database, settingsType } = options;
  const settingsId = settingsType.settingsType;
  for (const field of settingsType.fields) {
    const id = `${settingsId}:${field.key}`;
    try {
      await database.getRow("easy_settings", "id", id);
    } catch (e) {
      if (e instanceof OrmException && e.type == "EntryTypeNotFound") {
        options.onOutput?.(`Creating setting: ${field.key}`);
        await addSetting({
          database,
          field,
          settingsType: settingsType.settingsType,
        });
        continue;
      }
      throw e;
    }
  }
}

async function addSetting(options: {
  database: Database<any>;
  field: EasyField;
  settingsType: string;
}) {
  const { database, field, settingsType } = options;
  const id = `${settingsType}:${field.key}`;
  await database.insertRow("easy_settings", {
    id,
    settingsType,
    key: field.key,
    value: JSON.stringify({
      fieldType: field.fieldType,
      value: validateField(field, field.defaultValue || null),
    }),
  });
}
