import type { EasyAction } from "#/actions/actionTypes.ts";
import {
  getSettingsDefAction
} from "#/package/basePack/actions/settingsActions/getSettingsDefAction.ts";
import { getSettingsAction } from "#/package/basePack/actions/settingsActions/getSettingsRecord.ts";
import {
  updateSettingsRecordAction,
  updateSettingsValueAction,
} from "#/package/basePack/actions/settingsActions/updateSettingsRecordAction.ts";
import { runSettingsAction } from "#/package/basePack/actions/settingsActions/runSettingsAction.ts";

export const settingsActions: EasyAction[] = [
  getSettingsAction,
  getSettingsDefAction,
  updateSettingsRecordAction,
  updateSettingsValueAction,
  runSettingsAction,
];
