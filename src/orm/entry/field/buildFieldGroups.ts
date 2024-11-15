import type { SettingsType } from "../settings/settingsEntity.ts";
import { raiseOrmException } from "#orm/ormException.ts";
import type { EntryType } from "../entry/entryType/entryType.ts";
import type { FieldGroup } from "@vef/types";
export function buildFieldGroups(
  entity: EntryType | SettingsType,
): FieldGroup[] {
  const groups: Record<string, FieldGroup> = {
    default: {
      key: "default",
      title: "Default",
      fields: [],
    },
  };
  const groupKeys = entity.fieldGroups.map((group) => group.key);
  entity.fieldGroups.forEach((group) => {
    groups[group.key] = {
      ...group,
      fields: [],
    };
  });

  for (const field of entity.fields) {
    const groupKey = field.group || "default";
    if (!groupKeys.includes(groupKey)) {
      raiseOrmException(
        "InvalidFieldGroup",
        `Field group ${groupKey} in field ${field.key} does not exist in ${entity.key} entity`,
      );
    }
    groups[groupKey].fields.push(field);
  }
  return Object.values(groups);
}
