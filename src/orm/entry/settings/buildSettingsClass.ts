import type { EasyOrm } from "#orm/orm.ts";
import { SettingsClass } from "./settingsRecord.ts";
import { validateField } from "../field/validateField.ts";

import type {
  SettingsAction,
  SettingsHook,
  SettingsTypeDef,
  SettingsTypeHookDefinition,
} from "@vef/types";
import type { SettingsHookFunction } from "./settingsRecordTypes.ts";

export function buildSettingsRecordClass(
  orm: EasyOrm,
  settingsEntity: SettingsTypeDef,
) {
  const hooks = extractHooks(settingsEntity);
  const actions = extractActions(settingsEntity);
  const settingsRecordClass = class extends SettingsClass {
    override orm = orm;
    override settingsDefinition = settingsEntity;
    override _beforeSave = hooks.beforeSave;
    override _afterSave = hooks.afterSave;
    override _validate = hooks.validate;
    override _beforeValidate = hooks.beforeValidate;

    override actions: Record<string, SettingsAction> = actions;
  };

  setFields(settingsRecordClass, settingsEntity);
  return settingsRecordClass;
}

function setFields(
  settingsRecordClass: typeof SettingsClass,
  settingsEntity: SettingsTypeDef,
) {
  settingsEntity.fields.forEach((field) => {
    Object.defineProperty(settingsRecordClass.prototype, field.key, {
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

function extractActions(settingsEntity: SettingsTypeDef) {
  const actions: Record<string, SettingsAction> = {};
  settingsEntity.actions.forEach((action) => {
    actions[action.key] = action;
  });
  return actions;
}
function extractHooks(settingsEntity: SettingsTypeDef) {
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
  Object.entries(settingsEntity.hooks).forEach(([key, value]) => {
    hooks[key as SettingsHook] = getHookActions(value);
  });

  return hooks;
}
