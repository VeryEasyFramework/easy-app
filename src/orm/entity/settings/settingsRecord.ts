import type { EasyOrm } from "#orm/orm.ts";
import type {
  EasyFieldType,
  SafeType,
  SettingsAction,
  SettingsEntityDefinition,
  User,
} from "@vef/types";
import type { SettingsHookFunction } from "#orm/entity/settings/settingsRecordTypes.ts";

export interface SettingsRecord {
  beforeSave(): Promise<void> | void;
  afterSave(): Promise<void> | void;
  validate(): Promise<void> | void;
  beforeValidate(): Promise<void> | void;
  save(): Promise<Record<string, any>>;
  load(): Promise<void>;
  update(data: Record<string, any>): void;
  [key: string]: SafeType | null | undefined;
}
export class SettingsRecord implements SettingsRecord {
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

  update(data: Record<string, any>): void {
    for (const key in data) {
      if (!this.settingsDefinition.fields.find((field) => field.key === key)) {
        continue;
      }
      this[key] = data[key];
    }
  }
  async save(): Promise<Record<string, any>> {
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
}
