import type {
  ChildListDefinition,
  Choice,
  EasyField,
  FieldGroupDefinition,
} from "@vef/types";
import {
  camelToSnakeCase,
  camelToTitleCase,
  toCamelCase,
} from "@vef/string-utils";
import { raiseOrmException } from "#orm/ormException.ts";
import type { SettingsHook } from "@vef/types";
import type { SettingsActionDefinition } from "#orm/entity/settings/settingsRecordTypes.ts";
import type {
  SettingsEntityHookDefinition,
  SettingsEntityHooks,
} from "#orm/entity/settings/settingsRecordTypes.ts";
import type {
  EasyEntityHooks,
  EntityActionDefinition,
  EntityHook,
  EntityHookDefinition,
} from "#orm/entity/entity/entityDefinition/entityDefTypes.ts";

type EasyFieldDef = Omit<EasyField, "choices"> & {
  choices?: Array<Choice<PropertyKey>> | Array<string>;
};
export interface BaseDefinitionConfig {
  label: string;
  description: string;
  statusField?: string;
}

type DefType = "entity" | "settings";

export interface HooksDefMap {
  entity: EntityHookDefinition;
  settings: SettingsEntityHookDefinition;
}

export interface EasyHooksMap {
  entity: EasyEntityHooks;
  settings: SettingsEntityHooks;
}

export interface ActionsDefMap<F extends Array<EasyField>> {
  entity: EntityActionDefinition<F>;
  settings: SettingsActionDefinition<F>;
}
export interface ActionsMap {
  entity: EntityActionDefinition & { key: string };
  settings: SettingsActionDefinition & { key: string };
}
export interface HooksMap {
  entity: EntityHook;
  settings: SettingsHook;
}
export class BaseDefinition<
  C extends BaseDefinitionConfig,
  T extends DefType,
> {
  readonly key: string;
  readonly fields: Array<EasyField>;
  readonly fieldGroups: Array<FieldGroupDefinition>;

  private _statusField?: EasyField;

  get statusField(): EasyField | undefined {
    return this._statusField;
  }

  set statusField(fieldKey: string) {
    const field = this.fields.find((f) => f.key === fieldKey);
    if (!field) {
      raiseOrmException(
        "InvalidField",
        `Field with key ${fieldKey} not found in entity ${this.key}`,
      );
    }

    this._statusField = field;
  }

  readonly children: Array<ChildListDefinition>;

  config: C = {} as C;

  readonly actions: Array<ActionsMap[T]>;

  readonly hooks: EasyHooksMap[T];
  protected constructor(key: string, options?: {
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
      beforeDelete: [],
      afterDelete: [],
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

  addField(field: EasyFieldDef) {
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
    if (!field.label) {
      field.label = camelToTitleCase(field.key);
    }
    const choices: Choice<PropertyKey>[] = [];
    if (field.choices) {
      field.choices.forEach((choice) => {
        if (typeof choice === "string") {
          choices.push({
            key: choice,
            label: choice,
          });
        } else {
          choices.push(choice);
        }
      });
    }
    const newField: EasyField = {
      ...field,
      choices,
    };
    this.fields.push(newField);
  }

  addFields(fields: Array<EasyFieldDef>) {
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
