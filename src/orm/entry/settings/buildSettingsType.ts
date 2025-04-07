import type { EasyOrm } from "#orm/orm.ts";
import type { SettingsType } from "#orm/entry/settings/settingsType.ts";
import { buildFieldGroups } from "#orm/entry/field/buildFieldGroups.ts";
import type {
  FieldGroup,
  SettingsType as SettingsTypeDef,
} from "#/vef-types/mod.ts";

export function buildSettingsType(
  orm: EasyOrm,
  settingsType: SettingsType,
): SettingsTypeDef {
  const groups: FieldGroup[] = buildFieldGroups(settingsType);

  return {
    ...settingsType,
    fieldGroups: groups,
  } as SettingsTypeDef;
}
