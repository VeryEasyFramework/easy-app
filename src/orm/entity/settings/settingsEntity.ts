import { BaseDefinition } from "#orm/entity/baseDefinition.ts";
import type {
  SettingsAction,
  SettingsEntityHooks,
} from "#orm/entity/settings/settingsDefTypes.ts";

export interface SettingsEntityConfig {
  label: string;
  description: string;
}
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
