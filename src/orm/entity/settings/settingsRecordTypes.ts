import type { SettingsRecordClass } from "#orm/entity/settings/settingsRecord.ts";
import type {
  Choice,
  EasyField,
  EasyFieldTypeMap,
  SafeReturnType,
  SafeType,
} from "@vef/types";
export interface SettingsRecord extends SettingsRecordClass {
  [key: string]: any;
}
export type SettingsHookFunction = (
  settingsRecord: SettingsRecord,
) => Promise<void> | void;

export type SettingsActionFunction = (
  settingsRecord: SettingsRecord,
  params?: Record<string, SafeType>,
) => SafeReturnType;

export interface SettingsAction {
  key: string;
  label: string;
  description: string;
  action(
    settingsRecord: SettingsRecord,
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
    settingsRecord: SettingsRecord,
    params: D,
  ): Promise<any> | any;

  private?: boolean;

  params?: F;
}

export interface SettingsEntityHookDefinition {
  label?: string;
  description?: string;
  action(settings: SettingsRecord): Promise<void> | void;
}

export type SettingsEntityHooks = {
  beforeSave: Array<SettingsEntityHookDefinition>;
  afterSave: Array<SettingsEntityHookDefinition>;
  validate: Array<SettingsEntityHookDefinition>;
  beforeValidate: Array<SettingsEntityHookDefinition>;
};
