import type { EasyOrm } from "#orm/orm.ts";
import { SettingsClass } from "./settings.ts";
import { validateField } from "../field/validateField.ts";

import type {
  SettingsAction,
  SettingsHook,
  SettingsTypeDef,
  SettingsTypeHookDefinition,
} from "@vef/types";
import type { SettingsHookFunction } from "./settingsTypes.ts";

export function buildSettingsClass(
  orm: EasyOrm,
  settingsType: SettingsTypeDef,
) {
  const hooks = extractHooks(settingsType);
  const actions = extractActions(settingsType);
  const settingsRecordClass = class extends SettingsClass {
    override orm = orm;
    override settingsDefinition = settingsType;
    override _beforeSave = hooks.beforeSave;
    override _afterSave = hooks.afterSave;
    override _validate = hooks.validate;
    override _beforeValidate = hooks.beforeValidate;

    override actions: Record<string, SettingsAction> = actions;
  };

  setFields(settingsRecordClass, settingsType);
  return settingsRecordClass;
}

function setFields(
  settingsClass: typeof SettingsClass,
  settingsType: SettingsTypeDef,
) {
  settingsType.fields.forEach((field) => {
    Object.defineProperty(settingsClass.prototype, field.key, {
      get: function () {
        return this._data[field.key];
      },
      set: function (value) {
        value = validateField(field, value);
        if (this._data[field.key] === value) {
          return;
        }

        this._prevData[field.key] = this._data[field.key];
        this._data[field.key] = value;
        return value;
      },
    });
  });
}

function extractActions(settingsType: SettingsTypeDef) {
  const actions: Record<string, SettingsAction> = {};
  settingsType.actions.forEach((action) => {
    actions[action.key] = action;
  });
  return actions;
}
function extractHooks(settingsType: SettingsTypeDef) {
  const getHookActions = (hook: SettingsTypeHookDefinition[]) => {
    return hook.map((hookAction) => {
      return hookAction.action;
    });
  };
  const hooks: Record<SettingsHook, SettingsHookFunction[]> = {
    beforeSave: [],
    afterSave: [],
    validate: [],
    beforeValidate: [],
  };
  Object.entries(settingsType.hooks).forEach(([key, value]) => {
    hooks[key as SettingsHook] = getHookActions(value);
  });

  return hooks;
}
