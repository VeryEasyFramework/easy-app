import { EasyOrm } from "#orm/orm.ts";
import { SettingsEntity } from "#orm/entity/settings/settingsEntity.ts";
import { buildFieldGroups } from "#orm/entity/field/buildFieldGroups.ts";
import { SettingsEntityDefinition } from "#orm/entity/settings/settingsDefTypes.ts";
import type { FieldGroup } from "@vef/types";

export function buildSettingsEntity(
  orm: EasyOrm,
  settingsEntity: SettingsEntity,
): SettingsEntityDefinition {
  const groups: FieldGroup[] = buildFieldGroups(settingsEntity);

  return {
    ...settingsEntity,
    fieldGroups: groups,
  };
}
