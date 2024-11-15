import type { SettingsClass } from "./settings.ts";
import type { Choice, EasyField, EasyFieldTypeMap, SafeReturnType, SafeType, } from "@vef/types";

export interface Settings extends SettingsClass {
  [key: string]: any;
}
export type SettingsHookFunction = (
  settings: Settings,
) => Promise<void> | void;

export type SettingsActionFunction = (
  settingsRecord: Settings,
  params?: Record<string, SafeType>,
) => SafeReturnType;

export interface SettingsAction {
  key: string;
  label: string;
  description: string;
  action(
    settingsRecord: Settings,
    params: Record<string, any>,
  ): Promise<void> | void;
  params: Array<EasyField>;
}

export interface SettingsActionDefinition<
  F extends Array<EasyField> = Array<EasyField>,
  D extends {
    [key in F[number]["key"]]: F[number]["choices"] extends Choice<infer T>[]
      ? F[number]["choices"][number]["key"]
      : EasyFieldTypeMap[F[number]["fieldType"]];
  } = {
    [key in F[number]["key"]]: F[number]["choices"] extends Choice<infer T>[]
      ? F[number]["choices"][number]["key"]
      : EasyFieldTypeMap[F[number]["fieldType"]];
  },
> // D extends {
//   [key in F[number]["key"]]: EasyFieldTypeMap[F[number]["fieldType"]];
// } = { [key in F[number]["key"]]: EasyFieldTypeMap[F[number]["fieldType"]] },
{
  label?: string;
  description?: string;
  action(
    settingsRecord: Settings,
    params: D,
  ): Promise<any> | any;

  private?: boolean;

  params?: F;
}

export interface SettingsHookDefinition {
  label?: string;
  description?: string;
  action(settings: Settings): Promise<void> | void;
}

export type SettingsHooks = {
  beforeSave: Array<SettingsHookDefinition>;
  afterSave: Array<SettingsHookDefinition>;
  validate: Array<SettingsHookDefinition>;
  beforeValidate: Array<SettingsHookDefinition>;
};
