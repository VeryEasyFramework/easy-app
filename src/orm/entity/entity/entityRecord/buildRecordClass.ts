import type {
  EntityAction,
  EntityDefinition,
  EntityHook,
  EntityHookDefinition,
} from "@vef/types";
import { EntityRecord } from "#orm/entity/entity/entityRecord/entityRecord.ts";
import type { EntityHookFunction } from "#orm/entity/entity/entityRecord/entityRecordTypes.ts";
import type { EasyOrm } from "#orm/orm.ts";
import { validateField } from "#orm/entity/field/validateField.ts";
import { ChildList } from "#orm/entity/child/childRecord.ts";

export function buildRecordClass(orm: EasyOrm, entity: EntityDefinition) {
  const hooks = extractHooks(entity);
  const actions = extractActions(entity);
  const entityRecordClass = class extends EntityRecord {
    override entityDefinition = entity;
    override _beforeInsert: Array<EntityHookFunction> = hooks.beforeInsert;

    override _afterInsert: Array<EntityHookFunction> = hooks.afterInsert;

    override _beforeSave: Array<EntityHookFunction> = hooks.beforeSave;
    override _afterSave: Array<EntityHookFunction> = hooks.afterSave;

    override _validate: Array<EntityHookFunction> = hooks.validate;
    override _beforeValidate: Array<EntityHookFunction> = hooks.beforeValidate;

    override actions: Record<string, EntityAction> = actions;
    override orm = orm;
  };

  // entityRecordClass = bindHooks(entityRecordClass, entity);
  setFields(entityRecordClass, entity);
  buildChildren(entityRecordClass, entity, orm);
  return entityRecordClass;
}

function extractActions(entity: EntityDefinition) {
  const actions: Record<string, EntityAction> = {};
  entity.actions.forEach((action) => {
    actions[action.key] = action;
  });
  return actions;
}

function setFields(
  entityRecordClass: typeof EntityRecord,
  entity: EntityDefinition,
) {
  entity.fields.forEach((field) => {
    Object.defineProperty(entityRecordClass.prototype, field.key, {
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

function extractHooks(entity: EntityDefinition) {
  const getHookActions = (hook: EntityHookDefinition[]) => {
    return hook.map((hookAction) => {
      return hookAction.action;
    });
  };
  const hooks: Record<EntityHook, EntityHookFunction[]> = {
    beforeInsert: [],
    afterInsert: [],
    beforeSave: [],
    afterSave: [],
    validate: [],
    beforeValidate: [],
  };
  Object.entries(entity.hooks).forEach(([key, value]) => {
    hooks[key as EntityHook] = getHookActions(value);
  });

  return hooks;
}

function buildChildren(
  entityRecordClass: typeof EntityRecord,
  entity: EntityDefinition,
  orm: EasyOrm,
) {
  entity.children.forEach((child) => {
    const childClass = new ChildList(orm, child);
    Object.defineProperty(entityRecordClass.prototype, child.childName, {
      get: function () {
        return childClass;
      },
      set: function (value) {
        childClass.records = value;
      },
    });
  });
}
