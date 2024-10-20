import type { EasyOrm } from "#orm/orm.ts";
import { SettingsRecordClass } from "#orm/entity/settings/settingsRecord.ts";
import { validateField } from "#orm/entity/field/validateField.ts";

import type {
  SettingsAction,
  SettingsEntityDefinition,
  SettingsEntityHookDefinition,
  SettingsHook,
} from "@vef/types";
import type { SettingsHookFunction } from "#orm/entity/settings/settingsRecordTypes.ts";

export function buildSettingsRecordClass(
  orm: EasyOrm,
  settingsEntity: SettingsEntityDefinition,
) {
  const hooks = extractHooks(settingsEntity);
  const actions = extractActions(settingsEntity);
  const settingsRecordClass = class extends SettingsRecordClass {
    override orm = orm;
    override settingsDefinition = settingsEntity;
    override actions: Record<string, SettingsAction> = actions;
  };
  Object.keys(hooks).forEach((key) => {
    Object.defineProperty(settingsRecordClass, `_${key}`, {
      value: hooks[key as SettingsHook],
      writable: false,
    });
  });

  setFields(settingsRecordClass, settingsEntity);
  return settingsRecordClass;
}

function setFields(
  settingsRecordClass: typeof SettingsRecordClass,
  settingsEntity: SettingsEntityDefinition,
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

function extractActions(settingsEntity: SettingsEntityDefinition) {
  const actions: Record<string, SettingsAction> = {};
  settingsEntity.actions.forEach((action) => {
    actions[action.key] = action;
  });
  return actions;
}
function extractHooks(settingsEntity: SettingsEntityDefinition) {
  const getHookActions = (hook: SettingsEntityHookDefinition[]) => {
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
