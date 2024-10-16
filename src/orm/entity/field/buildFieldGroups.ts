import type { SettingsEntity } from "#orm/entity/settings/settingsEntity.ts";
import { raiseOrmException } from "#orm/ormException.ts";
import type { EasyEntity } from "#orm/entity/entity/entityDefinition/easyEntity.ts";
import type { FieldGroup } from "#orm/entity/entity/entityDefinition/entityDefTypes.ts";

export function buildFieldGroups(
  entity: EasyEntity | SettingsEntity,
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
