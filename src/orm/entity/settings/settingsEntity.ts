import { BaseDefinition } from "#orm/entity/baseDefinition.ts";
import type { SettingsAction, SettingsEntityConfig } from "@vef/types";
import type { SettingsRecordClass } from "#orm/entity/settings/settingsRecord.ts";
export interface SettingsEntityHookDefinition {
  label?: string;
  description?: string;
  action(settings: SettingsRecordClass): Promise<void> | void;
}

export type SettingsEntityHooks = {
  beforeSave: Array<SettingsEntityHookDefinition>;
  afterSave: Array<SettingsEntityHookDefinition>;
  validate: Array<SettingsEntityHookDefinition>;
  beforeValidate: Array<SettingsEntityHookDefinition>;
};
export class SettingsEntity
  extends BaseDefinition<SettingsEntityConfig, "settings"> {
  settingsId: string;
  declare readonly actions: Array<SettingsAction>;

  declare readonly hooks: SettingsEntityHooks;

  constructor(settingsName: string, options?: {
    label?: string;
    description?: string;
  }) {
    super(settingsName, options);
    this.settingsId = this.key;
  }
}
