import type { EasyField } from "#orm/entity/field/easyField.ts";
import type {
  EasyEntityHooks,
  EntityAction,
  EntityActionDefinition,
  EntityHook,
  EntityHookDefinition,
  FieldGroupDefinition,
} from "#orm/entity/entity/entityDefinition/entityDefTypes.ts";
import type { ChildListDefinition } from "#orm/entity/child/childEntity.ts";
import {
  camelToSnakeCase,
  camelToTitleCase,
  toCamelCase,
} from "@vef/string-utils";
import { raiseOrmException } from "#orm/ormException.ts";
import {
  SettingsAction,
  SettingsActionDefinition,
  SettingsEntityHookDefinition,
  SettingsEntityHooks,
  SettingsHook,
} from "#orm/entity/settings/settingsDefTypes.ts";
export interface BaseDefinitionConfig {
  label: string;
  description: string;
}

type DefType = "entity" | "settings";

interface HooksDefMap {
  entity: EntityHookDefinition;
  settings: SettingsEntityHookDefinition;
}

interface EasyHooksMap {
  entity: EasyEntityHooks;
  settings: SettingsEntityHooks;
}

interface ActionsDefMap {
  entity: EntityActionDefinition;
  settings: SettingsActionDefinition;
}
interface ActionsMap {
  entity: EntityAction;
  settings: SettingsAction;
}
interface HooksMap {
  entity: EntityHook;
  settings: SettingsHook;
}
export abstract class BaseDefinition<
  C extends BaseDefinitionConfig,
  T extends DefType,
> {
  readonly key: string;
  readonly fields: Array<EasyField>;
  readonly fieldGroups: Array<FieldGroupDefinition>;

  readonly children: Array<ChildListDefinition>;

  config: C = {} as C;

  readonly actions: Array<ActionsMap[T]>;

  readonly hooks: EasyHooksMap[T];
  constructor(key: string, options?: {
    label?: string;
    description?: string;
  }) {
    this.key = toCamelCase(camelToSnakeCase(key));
    this.fieldGroups = [{
      key: "default",
      title: "No Group",
      description: "The default field group",
    }];
    this.fields = [];
    this.children = [];
    this.actions = [];

    this.hooks = {
      beforeSave: [],
      afterSave: [],
      beforeInsert: [],
      afterInsert: [],
      validate: [],
      beforeValidate: [],
    };

    this.actions = [];

    // set the default config
    this.config.label = options?.label || camelToTitleCase(this.key);
    this.config.description = options?.description || "";
  }
  setConfig(config: Partial<C>) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  addField(field: EasyField) {
    // check if the field is already in the list by the key

    if (this.fields.find((f) => f.key === field.key)) {
      raiseOrmException(
        "InvalidField",
        `Field with key ${field.key} already exists in entity ${this.key}`,
      );
    }

    // check if the field key is a protected keyword
    if (["id", "data"].includes(field.key)) {
      raiseOrmException(
        "InvalidField",
        `Field with key ${field.key} is a protected keyword in entity ${this.key}`,
      );
    }
    this.fields.push(field);
  }

  addFields(fields: Array<EasyField>) {
    fields.forEach((field) => {
      this.addField(field);
    });
  }

  addFieldGroup(group: FieldGroupDefinition) {
    // check if the group is already in the list by the key
    if (this.fieldGroups.find((g) => g.key === group.key)) {
      raiseOrmException(
        "InvalidFieldGroup",
        `Field group with key ${group.key} already exists in entity ${this.key}`,
      );
    }

    this.fieldGroups.push(group);
  }

  addFieldGroups(groups: Array<FieldGroupDefinition>) {
    groups.forEach((group) => {
      this.addFieldGroup(group);
    });
  }

  addHook(hook: HooksMap[T], definition: HooksDefMap[T]) {
    (this.hooks as any)[hook].push(definition);
  }

  addAction(actionName: string, actionDefinition: ActionsDefMap[T]) {
    this.actions.push(
      {
        key: actionName,
        ...actionDefinition,
      } as ActionsMap[T],
    );
  }

  addChild(child: ChildListDefinition) {
    // check if the child is already in the list by the key
    if (this.children.find((c) => c.childName === child.childName)) {
      raiseOrmException(
        "InvalidChild",
        `Child with key ${child.childName} already exists in entity ${this.key}`,
      );
    }

    if (!child.config) {
      child.config = {
        tableName: "",
      };
    }
    if (!child.config.tableName) {
      child.config.tableName = `child_${this.key}_${
        camelToSnakeCase(child.childName)
      }`;
    }
    this.children.push(child);
  }
}
