import { SettingsRecord } from "#orm/entity/settings/settingsRecord.ts";
import { SafeReturnType, SafeType } from "#orm/entity/field/fieldTypes.ts";

export type SettingsHookFunction = (
  settingsRecord: SettingsRecord,
) => Promise<void> | void;

export type SettingsActionFunction = (
  settingsRecord: SettingsRecord,
  params?: Record<string, SafeType>,
) => SafeReturnType;
