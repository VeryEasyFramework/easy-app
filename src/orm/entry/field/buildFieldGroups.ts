import type { SettingsType } from "../settings/settingsType.ts";
import { raiseOrmException } from "#orm/ormException.ts";
import type { EntryType } from "../entry/entryType/entryType.ts";
import type { FieldGroup } from "#/vef-types/mod.ts";

export function buildFieldGroups(
  entryType: EntryType | SettingsType,
): FieldGroup[] {
  const groups: Record<string, FieldGroup> = {
    default: {
      key: "default",
      title: "Default",
      fields: [],
    },
  };
  const groupKeys = entryType.fieldGroups.map((group) => group.key);
  entryType.fieldGroups.forEach((group) => {
    groups[group.key] = {
      ...group,
      fields: [],
    };
  });

  for (const field of entryType.fields) {
    const groupKey = field.group || "default";
    if (!groupKeys.includes(groupKey)) {
      raiseOrmException(
        "InvalidFieldGroup",
        `Field group ${groupKey} in field ${field.key} does not exist in ${entryType.key} entry type`,
      );
    }
    groups[groupKey].fields.push(field);
  }
  return Object.values(groups);
}
