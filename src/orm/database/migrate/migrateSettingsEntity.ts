import { Database } from "#orm/database/database.ts";
import { SettingsEntity } from "#orm/entity/settings/settingsEntity.ts";
import { OrmException } from "#orm/ormException.ts";
import type { EasyField } from "@vef/types";
import { validateField } from "#orm/entity/field/validateField.ts";

export async function migrateSettingsEntity(options: {
  database: Database<any>;
  settingsEntity: SettingsEntity;
  onOutput?: (message: string) => void;
}) {
  const { database, settingsEntity } = options;
  const settingsId = settingsEntity.settingsId;
  for (const field of settingsEntity.fields) {
    const id = `${settingsId}:${field.key}`;
    try {
      await database.getRow("easy_settings", "id", id);
    } catch (e) {
      if (e instanceof OrmException && e.type == "EntityNotFound") {
        options.onOutput?.(`Creating setting: ${field.key}`);
        await addSetting({
          database,
          field,
          settingsId,
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
  settingsId: string;
}) {
  const { database, field, settingsId } = options;
  const id = `${settingsId}:${field.key}`;
  await database.insertRow("easy_settings", {
    id,
    settingsId,
    key: field.key,
    value: JSON.stringify({
      fieldType: field.fieldType,
      value: validateField(field, field.defaultValue || null),
    }),
  });
}
