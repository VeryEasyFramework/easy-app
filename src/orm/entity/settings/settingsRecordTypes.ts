import type { SettingsRecord } from "#orm/entity/settings/settingsRecord.ts";
import type { SafeReturnType, SafeType } from "@vef/types";

export type SettingsHookFunction = (
  settingsRecord: SettingsRecord,
) => Promise<void> | void;

export type SettingsActionFunction = (
  settingsRecord: SettingsRecord,
  params?: Record<string, SafeType>,
) => SafeReturnType;
