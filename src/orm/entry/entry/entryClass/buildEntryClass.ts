import type { EntryAction, EntryHook, EntryHookDefinition, EntryTypeDef, } from "@vef/types";
import { EntryClass } from "#orm/entry/entry/entryClass/entryClass.ts";
import type { EntryHookFunction } from "#orm/entry/entry/entryClass/entryClassTypes.ts";
import type { EasyOrm } from "#orm/orm.ts";
import { validateField } from "#orm/entry/field/validateField.ts";
import { ChildList } from "#orm/entry/child/childRecord.ts";

export function buildEntryClass(orm: EasyOrm, entryType: EntryTypeDef) {
  const hooks = extractHooks(entryType);
  const actions = extractActions(entryType);
  const entryClass = class extends EntryClass {
    override _entryType = entryType;

    override actions: Record<string, EntryAction> = actions;
    override _beforeInsert: EntryHookFunction[] = hooks.beforeInsert;
    override _afterInsert: EntryHookFunction[] = hooks.afterInsert;
    override _beforeSave: EntryHookFunction[] = hooks.beforeSave;
    override _afterSave: EntryHookFunction[] = hooks.afterSave;
    override _validate: EntryHookFunction[] = hooks.validate;
    override _beforeValidate: EntryHookFunction[] = hooks.beforeValidate;
    override _beforeDelete: EntryHookFunction[] = hooks.beforeDelete;
    override _afterDelete: EntryHookFunction[] = hooks.afterDelete;

    override orm = orm;
  };

  setFields(entryClass, entryType);
  buildMultiChoiceFields(entryClass, entryType, orm);
  buildChildren(entryClass, entryType, orm);
  return entryClass;
}

function extractActions(entryType: EntryTypeDef) {
  const actions: Record<string, EntryAction> = {};
  entryType.actions.forEach((action) => {
    actions[action.key] = action;
  });
  return actions;
}

function setFields(
  entryClass: typeof EntryClass,
  entryType: EntryTypeDef,
) {
  entryType.fields.forEach((field) => {
    if (field.fieldType === "MultiChoiceField") {
      return;
    }
    Object.defineProperty(entryClass.prototype, field.key, {
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

function extractHooks(entryType: EntryTypeDef) {
  const getHookActions = (hook: EntryHookDefinition[]) => {
    return hook.map((hookAction) => {
      return hookAction.action;
    });
  };
  const hooks: Record<EntryHook, EntryHookFunction[]> = {
    beforeInsert: [],
    afterInsert: [],
    beforeSave: [],
    afterSave: [],
    validate: [],
    beforeValidate: [],
    beforeDelete: [],
    afterDelete: [],
  };
  Object.entries(entryType.hooks).forEach(([key, value]) => {
    hooks[key as EntryHook] = getHookActions(value);
  });

  return hooks;
}

function buildChildren(
  entryClass: typeof EntryClass,
  entryType: EntryTypeDef,
  orm: EasyOrm,
) {
  entryType.children.forEach((child) => {
    const childClass = new ChildList(orm, child);
    Object.defineProperty(entryClass.prototype, child.childName, {
      get: function () {
        return childClass;
      },
      set: function (value) {
        childClass.records = value;
      },
    });
  });
}

function buildMultiChoiceFields(
  entryClass: typeof EntryClass,
  entryType: EntryTypeDef,
  orm: EasyOrm,
) {
  const fields = entryType.fields.filter((field) =>
    field.fieldType === "MultiChoiceField"
  );
  fields.forEach((field) => {
    Object.defineProperty(entryClass.prototype, field.key, {
      get: function () {
        return this._multiChoiceData[field.key] || [];
      },
      set: function (value) {
        this._multiChoiceData[field.key] = value || [];
      },
    });
  });
}
