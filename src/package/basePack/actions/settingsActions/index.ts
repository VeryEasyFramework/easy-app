import type { EasyAction } from "#/actions/actionTypes.ts";
import {
  getSettingsTypeAction,
} from "#/package/basePack/actions/settingsActions/getSettingsTypeAction.ts";
import { getSettingsAction } from "./getSettingsAction.ts";
import {
  updateSettingsRecordAction,
  updateSettingsValueAction,
} from "#/package/basePack/actions/settingsActions/updateSettingsRecordAction.ts";
import { runSettingsAction } from "#/package/basePack/actions/settingsActions/runSettingsAction.ts";

export const settingsActions: EasyAction[] = [
  getSettingsAction,
  getSettingsTypeAction,
  updateSettingsRecordAction,
  updateSettingsValueAction,
  runSettingsAction,
];
