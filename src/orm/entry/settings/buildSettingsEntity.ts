import type { EasyOrm } from "#orm/orm.ts";
import type { SettingsType } from "./settingsEntity.ts";
import { buildFieldGroups } from "../field/buildFieldGroups.ts";
import type { FieldGroup, SettingsTypeDef } from "@vef/types";

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
