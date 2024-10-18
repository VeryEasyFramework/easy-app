import type { EasyOrm } from "#orm/orm.ts";
import type {
  Choice,
  EasyField,
  EasyFieldType,
  EasyFieldTypeMap,
  SafeType,
  SettingsAction,
  SettingsEntityDefinition,
  User,
} from "@vef/types";
import type { SettingsHookFunction } from "#orm/entity/settings/settingsRecordTypes.ts";
import { raiseOrmException } from "#orm/ormException.ts";
import { easyLog } from "#/log/logging.ts";
export interface SettingsRecordClass {
  orm: EasyOrm;

  settingsDefinition: SettingsEntityDefinition;
  _user?: User;

  beforeSave(): Promise<void> | void;
  afterSave(): Promise<void> | void;
  validate(): Promise<void> | void;
  beforeValidate(): Promise<void> | void;
  save(): Promise<Record<string, any>>;
  load(): Promise<void>;
  runAction(actionKey: string, data?: Record<string, SafeType>): Promise<any>;
  update(data: Record<string, any>): void;
  [key: string]: SafeType | null | undefined;
}
export class SettingsRecordClass implements SettingsRecordClass {
  private _data: Record<string, any> = {};
  private _prevData: Record<string, any> = {};
  _user?: User;

  orm!: EasyOrm;

  settingsDefinition!: SettingsEntityDefinition;

  _beforeSave!: Array<SettingsHookFunction>;

  _afterSave!: Array<SettingsHookFunction>;

  _validate!: Array<SettingsHookFunction>;

  _beforeValidate!: Array<SettingsHookFunction>;

  actions!: Record<string, SettingsAction>;
  get data(): Record<string, SafeType> {
    return this._data;
  }

  async afterSave(): Promise<void> {
    for (const hook of this._afterSave) {
      await hook(this);
    }
  }

  async beforeSave(): Promise<void> {
    for (const hook of this._beforeSave) {
      await hook(this);
    }
  }

  async validate(): Promise<void> {
    await this.beforeValidate();
    for (const hook of this._validate) {
      await hook(this);
    }
  }

  async beforeValidate(): Promise<void> {
    for (const hook of this._beforeValidate) {
      await hook(this);
    }
  }

  update(data: Record<string, any>): void {
    for (const key in data) {
      const field = this.settingsDefinition.fields.find((f) => f.key === key);
      if (!field) {
        continue;
      }
      if (field.readOnly) {
        continue;
      }
      this[key] = data[key];
    }
  }
  async save(): Promise<Record<string, any>> {
    await this.validate();
    await this.beforeSave();
    const changedData = this.getChangedData();
    if (!changedData) {
      return this.data;
    }
    for (const key in changedData) {
      const field = this.settingsDefinition.fields.find((f) => f.key === key);
      if (!field) {
        continue;
      }
      const value = this.orm.database.adaptSaveValue(field, changedData[key]);
      const id = `${this.settingsDefinition.settingsId}:${key}`;
      await this.orm.database.updateRow("easy_settings", id, {
        value: JSON.stringify({
          fieldType: field.fieldType,
          value,
        }),
      });
    }
    await this.afterSave();

    await this.orm.runGlobalSettingsHook(
      "afterChange",
      this.settingsDefinition.settingsId,
      this,
      changedData,
    );
    return this.data;
  }
  async load(): Promise<void> {
    // load data from db

    const results = await this.orm.database.getRows<{
      key: string;
      value: {
        fieldType: EasyFieldType;
        value: SafeType;
      };
    }>("easy_settings", {
      filter: {
        settingsId: this.settingsDefinition.settingsId,
      },
      columns: ["key", "value"],
    });

    for (const row of results.data) {
      const field = this.settingsDefinition.fields.find(
        (f) => f.key === row.key,
      );
      if (!field) {
        throw new Error(`Field not found: ${row.key}`);
      }
      this._data[row.key] = this.orm.database.adaptLoadValue(
        field,
        row.value.value,
      );
    }
  }
  private getChangedData(): Record<string, any> | undefined {
    let hasChanged = false;
    const changedData: Record<string, any> = {};
    for (const key in this._prevData) {
      if (this._data[key] != this._prevData[key]) {
        hasChanged = true;
        changedData[key] = this._data[key];
      }
    }
    if (!hasChanged) {
      return;
    }
    return changedData;
  }

  async runAction(
    actionKey: string,
    data?: Record<string, SafeType>,
  ): Promise<any> {
    const action = this.actions[actionKey];
    if (!action) {
      raiseOrmException(
        "InvalidAction",
        `Action ${actionKey} not found in entity ${this.settingsDefinition.settingsId}`,
      );
    }
    if (action.params) {
      for (const param of action.params) {
        if (param.required && !data?.[param.key]) {
          raiseOrmException(
            "MissingActionParam",
            `Missing required param ${param.key} for action ${actionKey}`,
          );
        }
      }
    }
    data = data || {};
    return await action.action(this, data);
  }
}
export interface SettingsActionDefinition<
  F extends Array<EasyField> = Array<EasyField>,
  D extends {
    [key in F[number]["key"]]: F[number]["choices"] extends Choice<infer T>[]
      ? F[number]["choices"][number]["key"]
      : EasyFieldTypeMap[F[number]["fieldType"]];
  } = {
    [key in F[number]["key"]]: F[number]["choices"] extends Choice<infer T>[]
      ? F[number]["choices"][number]["key"]
      : EasyFieldTypeMap[F[number]["fieldType"]];
  },
> // D extends {
//   [key in F[number]["key"]]: EasyFieldTypeMap[F[number]["fieldType"]];
// } = { [key in F[number]["key"]]: EasyFieldTypeMap[F[number]["fieldType"]] },
{
  label?: string;
  description?: string;
  action(
    settingsRecord: SettingsRecordClass,
    params: D,
  ): Promise<any> | any;

  private?: boolean;

  params?: F;
}
