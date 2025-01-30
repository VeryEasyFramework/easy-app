import type { EntryHookFunction } from "./entryClassTypes.ts";
import type {
  EasyFieldType,
  EasyFieldTypeMap,
  Entry,
  EntryAction,
  EntryType as EntryTypeDef,
  FieldMethod,
  RowsResult,
  SafeType,
  User,
} from "@vef/types";

import { raiseOrmException } from "#orm/ormException.ts";
import type { EasyOrm } from "#orm/orm.ts";
import { dateUtils } from "#orm/utils/dateUtils.ts";
import { generateId, isEmpty } from "#orm/utils/misc.ts";
import type { ChildList } from "#orm/entry/child/childRecord.ts";

export class EntryClass {
  private _data: Record<string, any> = {};

  private _multiChoiceData: Record<string, any> = {};

  private _prevData: Record<string, any> = {};
  private _isNew: boolean = true;
  private _primaryKey?: string;

  _user?: User;
  orm!: EasyOrm;

  get primaryKey(): string | undefined {
    return this._primaryKey;
  }
  set primaryKey(value: string | undefined) {
    this._primaryKey
      ? raiseOrmException(
        "PrimaryKeyAlreadySet",
        "Primary key is already set",
      )
      : this._primaryKey = value;
  }
  get id(): EasyFieldTypeMap["IDField"] {
    if (this.primaryKey) {
      return this._data[this.primaryKey];
    }
    return this._data.id;
  }

  get createdAt(): EasyFieldTypeMap["TimeStampField"] {
    return this._data.createdAt;
  }

  set createdAt(value: EasyFieldTypeMap["TimeStampField"]) {
    this._data.createdAt = value;
  }

  get updatedAt(): EasyFieldTypeMap["TimeStampField"] {
    return this._data.updatedAt;
  }

  set updatedAt(value: EasyFieldTypeMap["TimeStampField"]) {
    this._data.updatedAt = value;
  }
  get data(): Record<string, SafeType> {
    const keys = this._entryType.fields.filter((field) => field.hidden)
      .map((field) => field.key);
    const data = { ...this._data };
    for (const key of keys) {
      delete data[key];
    }

    const childrenKeys = this._entryType.children.map(
      (child) => child.childName,
    );

    const multiChoiceKeys = this._entryType.fields.filter(
      (field) => field.fieldType === "MultiChoiceField",
    ).map((field) => field.key);

    for (const key of childrenKeys) {
      data[key] = (this[key as keyof this] as ChildList).records;
    }

    for (const key of multiChoiceKeys) {
      data[key] = this[key as keyof this];
    }

    return data;
  }

  _entryType!: EntryTypeDef;

  _beforeInsert!: Array<EntryHookFunction>;

  _afterInsert!: Array<EntryHookFunction>;

  _beforeSave!: Array<EntryHookFunction>;

  _afterSave!: Array<EntryHookFunction>;

  _validate!: Array<EntryHookFunction>;

  _beforeValidate!: Array<EntryHookFunction>;

  _beforeDelete!: Array<EntryHookFunction>;

  _afterDelete!: Array<EntryHookFunction>;

  _actions!: Record<string, EntryAction>;

  get _title(): string {
    const titleField = this._entryType.config.titleField || "id";

    return this[titleField as keyof this] as string;
  }
  async beforeInsert() {
    this.setCreatedAt();
    this._data = this.setDefaultValues(this._data);
    for (const hook of this._beforeInsert) {
      await hook(this);
    }
  }
  async afterInsert() {
    for (const hook of this._afterInsert) {
      await hook(this);
    }
  }
  async beforeSave() {
    this.setUpdatedAt();
    for (const hook of this._beforeSave) {
      await hook(this);
    }
  }

  async beforeDelete() {
    for (const hook of this._beforeDelete) {
      await hook(this);
    }
  }

  async afterDelete() {
    for (const hook of this._afterDelete) {
      await hook(this);
    }
  }
  async afterSave() {
    await this.syncFetchFields();
    for (const hook of this._afterSave) {
      await hook(this);
    }
  }
  async validate() {
    for (const hook of this._beforeValidate) {
      await hook(this);
    }

    await this.validateConnectionFields();
    this.setIdIfNew();
    await this.validateChildren();
    for (const hook of this._validate) {
      await hook(this);
    }
  }

  async load(id: string | number) {
    this._prevData = {};
    const idKey = this.primaryKey || "id";
    const data = await this.orm.database.getRow(
      this._entryType.config.tableName,
      idKey,
      id,
    );
    this._data = this.parseDatabaseRow(data);
    this._isNew = false;
    await this.loadMultiChoiceFields();
    await this.loadChildren();
  }

  private async loadChildren() {
    for (const child of this._entryType.children) {
      const childClass = this[child.childName as keyof this] as ChildList;
      await childClass.load(this.id);
    }
  }

  private async loadMultiChoiceFields() {
    const fields = this._entryType.fields.filter((field) =>
      field.fieldType === "MultiChoiceField"
    );

    for (const field of fields) {
      const values = await this.orm.database.getRows(
        `${this._entryType.entryType}_${field.key}_mc_values`,
        {
          filter: {
            parentId: this.id,
          },
        },
      );

      const data = values.data.map((value) => {
        return value.value;
      });
      this[field.key as keyof this] = data as any;
    }
  }

  /**
   * This method is used to save the entry to the database.
   * It returns the changed data.
   */
  async save(): Promise<Record<string, any> | undefined> {
    await this.validate();

    if (this._isNew) {
      await this.refreshFetchedFields();
      await this.beforeInsert();
      await this.beforeSave();
      const changed = this.adaptChangedData(this._data);
      if (
        changed.id === null &&
        this._entryType.config.idMethod.type === "number" &&
        this._entryType.config.idMethod.autoIncrement
      ) {
        delete changed.id;
      }
      const response = await this.orm.database.insertRow<RowsResult<Entry>>(
        this._entryType.config.tableName,
        changed,
      );
      this._data.id = response.data[0].id;

      await this.saveChildren();
      await this.saveMultiChoiceFields();
      await this.afterInsert();
      await this.afterSave();
      this._isNew = false;
      this._prevData = {};
      await this.orm.runGlobalHook(
        "afterInsert",
        this._entryType.entryType,
        this,
      );
      return changed;
    }
    await this.refreshFetchedFields();
    await this.beforeSave();
    await this.saveMultiChoiceFields();
    await this.saveChildren();
    let changedData = this.getChangedData();

    if (!changedData) {
      return;
    }
    changedData = this.adaptChangedData(changedData);

    await this.orm.database.updateRow(
      this._entryType.config.tableName,
      this.id,
      changedData,
    );

    await this.afterSave();
    this._prevData = {};
    this._entryType.fields.forEach((field) => {
      if (field.hidden && field.key in changedData) {
        changedData[field.key] = "********";
      }
    });
    await this.orm.runGlobalHook(
      "afterChange",
      this._entryType.entryType,
      this,
      changedData,
    );
    return changedData;
  }

  private changedChildren() {
    const childrenKeys = this._entryType.children.map((child) =>
      child.childName
    );
    const changed: string[] = [];
    for (const key of childrenKeys) {
      const child = this[key as keyof this] as ChildList;
      if (child.changed) {
        changed.push(key);
      }
    }
    return changed;
  }

  private async saveMultiChoiceFields() {
    const multiChoiceFields = this._entryType.fields.filter(
      (field) => field.fieldType === "MultiChoiceField",
    );
    for (const field of multiChoiceFields) {
      const values = this[field.key as keyof this] as Record<string, any>[];
      await this.orm.database.deleteRows(
        `${this._entryType.entryType}_${field.key}_mc_values`,
        {
          parentId: this.id,
        },
      );
      for (const value of values) {
        await this.orm.database.insertRow(
          `${this._entryType.entryType}_${field.key}_mc_values`,
          {
            id: generateId(16),
            parentId: this.id,
            value,
          },
        );
      }
    }
  }
  private async saveChildren() {
    const changedChildren = this.changedChildren();
    if (changedChildren.length === 0) {
      return;
    }

    for (const key of changedChildren) {
      const child = this[key as keyof this] as ChildList;
      child.parentId = this.id as string;
      await child.save();
    }
  }

  private async deleteChildren() {
    const childrenKeys = this._entryType.children.map((child) =>
      child.childName
    );
    for (const key of childrenKeys) {
      const childList = this[key as keyof this] as ChildList;
      await childList.clear();
    }
  }

  private async validateChildren() {
  }
  async delete() {
    if (!this.id) {
      raiseOrmException("InvalidId", "Cannot delete entry without an id");
    }
    await this.beforeDelete();

    await this.deleteChildren();
    const idKey = this.primaryKey || "id";
    await this.orm.database.deleteRow(
      this._entryType.config.tableName,
      idKey,
      this.id,
    );
    await this.afterDelete();
    await this.orm.runGlobalHook(
      "afterDelete",
      this._entryType.entryType,
      this,
    );
  }

  update(data: Record<string, any>): void {
    const childKeys = this._entryType.children.map((child) => child.childName);
    for (const key in data) {
      if (childKeys.includes(key)) {
        this[key as keyof this] = data[key];
        continue;
      }
      if (!this._entryType.fields.find((field) => field.key === key)) {
        continue;
      }
      this[key as keyof this] = data[key];
    }
  }

  async enqueueAction(
    actionKey: string,
    data?: Record<string, any>,
  ): Promise<Record<string, any>> {
    this.validateAction(actionKey, data);
    data = data || {};

    const task = await this.orm.createEntry("taskQueue", {
      taskType: "entry",
      entryType: this._entryType.entryType,
      entryId: this.id,
      entryTitle: this._title,
      action: actionKey,
      taskData: data,
    });
    return task.data;
  }

  private validateAction(actionKey: string, data?: Record<string, any>) {
    const action = this._actions[actionKey];
    if (!action) {
      raiseOrmException(
        "InvalidAction",
        `Action ${actionKey} not found in entry type ${this._entryType.entryType}`,
      );
    }
    if (action.params && !action.customValidation) {
      for (const param of action.params) {
        if (param.required && !data?.[param.key]) {
          raiseOrmException(
            "MissingActionParam",
            `Missing required param ${param.key} for action ${actionKey}`,
          );
        }
      }
    }
    return action;
  }
  async runAction<R = Record<string, any> | string | number | void>(
    actionKey: string,
    data?: Record<string, any>,
  ): Promise<R> {
    const action = this.validateAction(actionKey, data);

    data = data || {};
    return await action.action(this, data) as R;
  }
  /**
   * Base fields
   */

  private setCreatedAt() {
    if (!this.createdAt) {
      this.createdAt = dateUtils.nowTimestamp();
    }
  }

  private setUpdatedAt() {
    this.updatedAt = dateUtils.nowTimestamp();
  }

  private async setIdIfNew() {
    if (!this._isNew) {
      return;
    }
    const method = this._entryType.config.idMethod;
    let id: string | number | null;
    switch (method.type) {
      case "hash":
        id = generateId(method.hashLength);
        break;
      case "number": {
        if (method.autoIncrement) {
          id = null;
          break;
        }
        const result = await this.orm.database.getRows(
          this._entryType.config.tableName,
          {
            orderBy: "id",
            order: "desc",
            limit: 1,
            columns: ["id"],
          },
        );
        if (result.rowCount > 0) {
          id = result.data[0].id as number + 1;
          break;
        }
        id = 1;

        break;
      }
      case "uuid":
        id = crypto.randomUUID();
        break;
      case "series":
        id = null;
        break;
      case "data":
        id = null;
        break;
      case "field":
        if (!method.field) {
          raiseOrmException(
            "InvalidField",
            "Field method requires a field name",
          );
        }
        id = this._data[method.field];
        break;
    }
    if (this.primaryKey) {
      this[this.primaryKey as keyof this] = id as any;
      return;
    }
    this._data.id = id;
    this._prevData.id = null;

    // set children ids

    const childrenKeys = this._entryType.children.map((child) =>
      child.childName
    );

    for (const key of childrenKeys) {
      (this[key as keyof this] as ChildList).parentId = id as string;
    }
  }
  private parseDatabaseRow(row: Record<string, any>) {
    const data: Record<string, SafeType> = {};
    ["id", "createdAt", "updatedAt"].forEach((key) => {
      if (key in row) {
        data[key] = row[key];
      }
    });
    this._entryType.fields.forEach((field) => {
      if (field.key in row) {
        data[field.key] = this.orm.database.adaptLoadValue(
          field,
          row[field.key],
        );
      }
    });
    return data;
  }

  /**
   * Get the values that have changed if any (values that have been updated and not saved yet)
   */
  getChangedData(): Record<string, any> | undefined {
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
  isValueChanged(key: string): boolean {
    return this._data[key] !== this._prevData[key];
  }
  private adaptChangedData(changedData: Record<string, any>) {
    const adaptedData: Record<string, any> = {};
    for (const key in changedData) {
      if (key === "updatedAt" || key === "createdAt") {
        adaptedData[key] = this.orm.database.adaptSaveValue(
          "TimeStampField",
          changedData[key],
        );
        continue;
      }
      if (key === "id") {
        const type = this._entryType.config.idMethod.type;
        let fieldType: EasyFieldType = "DataField";
        switch (type) {
          case "number":
            fieldType = "IntField";
            break;
          case "series":
            fieldType = "IntField";
            break;
          case "hash":
            break;
          case "uuid":
            break;
          case "field":
            fieldType = this._entryType.fields.find(
              (field) =>
                field.key ===
                  (this._entryType.config.idMethod as FieldMethod).field,
            )?.fieldType || "DataField";
            break;
          case "data":
            break;

          default:
            fieldType = "DataField";
        }
        adaptedData[key] = this.orm.database.adaptSaveValue(
          fieldType,
          changedData[key],
        );
        continue;
      }
      let fieldType: EasyFieldType | undefined;
      this._entryType.fields.forEach((field) => {
        if (field.key === key) {
          fieldType = field.fieldType;
        }
      });

      if (!fieldType) {
        raiseOrmException(
          "InvalidField",
          `Field ${key} not found in Entry Type ${this._entryType.entryType}`,
        );
      }

      adaptedData[key] = this.orm.database.adaptSaveValue(
        fieldType,
        changedData[key],
      );
    }
    return adaptedData;
  }
  /**
   * Fetch Fields Magic
   */

  async syncFetchFields(force?: boolean) {
    // return;
    const entry = this.orm.registry.findInRegistry(
      this._entryType.entryType,
    );
    if (!entry) {
      return;
    }
    const fieldKeys = Object.keys(entry);
    for (const key of fieldKeys) {
      if (!(key in this._prevData) && !force) {
        continue;
      }
      const value = this._data[key];

      const targets = entry[key];
      for (const target of targets) {
        await this.orm.batchUpdateField(
          target.entryType,
          target.field as string,
          value,
          {
            [target.idKey]: this.id,
          },
        );
      }
    }
  }

  /**
   * Fetches the values of fields that have `fetchOptions` set
   */
  async refreshFetchedFields() {
    const fields = this._entryType.fields.filter((field) => field.fetchOptions);
    for (const field of fields) {
      const { fetchEntryType, thatFieldKey, thisFieldKey, thisIdKey } = field
        .fetchOptions!;

      const id = this[thisIdKey as keyof this] as string | undefined;

      if (!id) {
        this[thisFieldKey as keyof this] = null as any;
        continue;
      }
      this[thisFieldKey as keyof this] = await this.orm.getValue(
        fetchEntryType,
        id,
        thatFieldKey,
      );
    }
  }

  private setDefaultValues(data: Record<PropertyKey, any>) {
    for (const field of this._entryType.fields) {
      if (field.fieldType === "MultiChoiceField") {
        continue;
      }
      if (field.fieldType === "BooleanField" && isEmpty(data[field.key])) {
        data[field.key] = false;
        continue;
      }
      if (field.key in data && !isEmpty(data[field.key])) {
        continue;
      }

      if (!isEmpty(field.defaultValue)) {
        data[field.key] = typeof field.defaultValue === "function"
          ? field.defaultValue()
          : field.defaultValue;
        continue;
      }
      switch (field.fieldType) {
        case "BooleanField":
          data[field.key] = false;
          break;
        case "JSONField":
          data[field.key] = {};
          break;
        case "ListField":
          data[field.key] = [];
          break;
        case "IntField":
          data[field.key] = null;
          break;
        case "BigIntField":
          data[field.key] = null;
          break;
        default:
          if (Object.keys(data).includes(field.key as string)) {
            data[field.key] = null;
          }
          break;
      }
    }
    return data;
  }
  private async validateConnectionFields() {
    const changedData = this.getChangedData();
    if (!changedData) {
      return;
    }
    const keys = Object.keys(changedData);

    const fields = this._entryType.fields.filter((field) =>
      field.fieldType === "ConnectionField" && keys.includes(field.key)
    );

    for (const field of fields) {
      const id = changedData[field.key];
      if (!id) {
        continue;
      }
      if (
        !await this.orm.exists(
          field.connectionEntryType!,
          changedData[field.key],
        )
      ) {
        raiseOrmException(
          "InvalidConnection",
          `Invalid connection for field ${field.label} in entry type ${this._entryType.entryType}`,
        );
      }
    }
  }
}
