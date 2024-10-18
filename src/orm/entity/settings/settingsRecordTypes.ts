import type { SettingsRecordClass } from "#orm/entity/settings/settingsRecord.ts";
import type { SafeReturnType, SafeType } from "@vef/types";

export type SettingsHookFunction = (
  settingsRecord: SettingsRecordClass,
) => Promise<void> | void;

export type SettingsActionFunction = (
  settingsRecord: SettingsRecordClass,
  params?: Record<string, SafeType>,
) => SafeReturnType;
