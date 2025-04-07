import { BaseDefinition } from "#orm/entry/baseDefinition.ts";
import type {
  Choice,
  EasyField,
  SettingsHook,
  SettingsTypeConfig,
} from "#/vef-types/mod.ts";
import type {
  Settings,
  SettingsActionDefinition,
  SettingsHooks,
} from "#orm/entry/settings/settingsTypes.ts";

export class SettingsType
  extends BaseDefinition<SettingsTypeConfig, "settings"> {
  settingsType: string;

  hooks: SettingsHooks = {
    beforeSave: [],
    afterSave: [],
    validate: [],
    beforeValidate: [],
  };
  constructor(settingsName: string, options?: {
    label?: string;
    description?: string;
  }) {
    super(settingsName, options);
    this.settingsType = this.key;
  }
  addHook(hook: SettingsHook, definition: {
    label?: string;
    description?: string;
    action(settings: Settings): Promise<void> | void;
  }) {
    this.hooks[hook].push(definition);
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
