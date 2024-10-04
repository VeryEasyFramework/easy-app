import type { EasyAction } from "#/actions/actionTypes.ts";
import { getSettingsDefAction } from "#/package/basePack/actions/settingsActions/getSettingsDefAction.ts";
import { getSettingsRecordAction } from "#/package/basePack/actions/settingsActions/getSettingsRecord.ts";
import {
  updateSettingsRecordAction,
  updateSettingsValueAction,
} from "#/package/basePack/actions/settingsActions/updateSettingsRecordAction.ts";

export const settingsActions: EasyAction[] = [
  getSettingsRecordAction,
  getSettingsDefAction,
  updateSettingsRecordAction,
  updateSettingsValueAction,
];
