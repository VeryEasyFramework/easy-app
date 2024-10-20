import { BaseDefinition } from "#orm/entity/baseDefinition.ts";
import type {
  Choice,
  EasyField,
  SettingsAction,
  SettingsEntityConfig,
  SettingsHook,
} from "@vef/types";
import type {
  SettingsActionDefinition,
  SettingsEntityHookDefinition,
  SettingsEntityHooks,
} from "#orm/entity/settings/settingsRecordTypes.ts";

export class SettingsEntity
  extends BaseDefinition<SettingsEntityConfig, "settings"> {
  settingsId: string;

  declare readonly hooks: SettingsEntityHooks;

  constructor(settingsName: string, options?: {
    label?: string;
    description?: string;
  }) {
    super(settingsName, options);
    this.settingsId = this.key;
  }
  addHook(hook: SettingsHook, definition: SettingsEntityHookDefinition) {
    (this.hooks as any)[hook].push(definition);
  }

  addAction<
    P extends string,
    K extends PropertyKey,
    C extends Choice<K>[],
    F extends Array<EasyField<P, K, C>>,
  >(
    actionName: string,
    actionDefinition: SettingsActionDefinition<F>,
  ) {
    this.actions.push(
      {
        key: actionName,
        ...actionDefinition,
      } as SettingsActionDefinition & { key: string },
    );
  }
}
