import type { EasyOrm } from "#orm/orm.ts";
import type {
  EasyFieldType,
  SafeType,
  SettingsType,
  User,
} from "#/vef-types/mod.ts";

import type { SettingsAction, SettingsHookFunction } from "./settingsTypes.ts";
import { raiseOrmException } from "#orm/ormException.ts";

export class SettingsClass {
  private _data: Record<string, any> = {};
  private _prevData: Record<string, any> = {};
  _user?: User;

  orm!: EasyOrm;

  _settingsType!: SettingsType;

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
      const field = this._settingsType.fields.find((f) => f.key === key);
      if (!field) {
        continue;
      }
      if (field.readOnly) {
        continue;
      }
      this[key as keyof this] = data[key];
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
      const field = this._settingsType.fields.find((f) => f.key === key);
      if (!field) {
        continue;
      }
      const value = this.orm.database.adaptSaveValue(field, changedData[key]);
      const id = `${this._settingsType.settingsType}:${key}`;
      await this.orm.database.updateRow("easy_settings", id, {
        value: JSON.stringify({
          fieldType: field.fieldType,
          value,
        }),
      });
    }
    await this.load();

    await this.afterSave();

    await this.orm.runGlobalSettingsHook(
      "afterChange",
      this._settingsType.settingsType,
      this,
      changedData,
    );
    return this.data;
  }

  async load(): Promise<void> {
    const results = await this.orm.database.getRows<{
      key: string;
      value: {
        fieldType: EasyFieldType;
        value: SafeType;
      };
    }>("easy_settings", {
      filter: {
        settingsType: this._settingsType.settingsType,
      },
      columns: ["key", "value"],
    });

    for (const row of results.data) {
      const field = this._settingsType.fields.find(
        (f) => f.key === row.key,
      );
      if (!field) {
        continue;
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
  private validateAction(actionKey: string, data?: Record<string, any>) {
    const action = this.actions[actionKey];
    if (!action) {
      raiseOrmException(
        "InvalidAction",
        `Action ${actionKey} not found in settings ${this._settingsType.settingsType}`,
      );
    }
    if (action.params) {
      for (const param of action.params) {
        if (param.required && !data?.[param.key]) {
          raiseOrmException(
            "MissingActionParam",
            `Missing  required param ${param.key} for action ${actionKey}`,
          );
        }
      }
    }
    return action;
  }
  async runAction(
    actionKey: string,
    data?: Record<string, SafeType>,
  ): Promise<any> {
    const action = this.validateAction(actionKey, data);
    data = data || {};
    return await action.action(this, data);
  }

  async enqueueAction(
    action: string,
    data: Record<string, any>,
  ): Promise<void> {
    this.validateAction(action, data);
    await this.orm.createEntry("taskQueue", {
      taskType: "settings",
      entryType: this._settingsType.settingsType,
      worker: "medium",
      status: "queued",
      title: this._settingsType.config.label,
      action,
      taskData: data,
    });
  }
}
