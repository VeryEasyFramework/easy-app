import type { EntityHookFunction } from "#orm/entity/entity/entityRecord/entityRecordTypes.ts";
import type {
  EasyFieldType,
  EasyFieldTypeMap,
  EntityAction,
  EntityDefinition,
  FieldMethod,
  SafeType,
  User,
} from "@vef/types";
import { raiseOrmException } from "#orm/ormException.ts";
import type { EasyOrm } from "#orm/orm.ts";
import { dateUtils } from "#orm/utils/dateUtils.ts";
import { generateId, isEmpty } from "#orm/utils/misc.ts";
import type { ChildList } from "#orm/entity/child/childRecord.ts";

export class EntityRecordClass {
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
    const keys = this.entityDefinition.fields.filter((field) => field.hidden)
      .map((field) => field.key);
    const data = { ...this._data };
    for (const key of keys) {
      delete data[key];
    }

    const childrenKeys = this.entityDefinition.children.map(
      (child) => child.childName,
    );

    const multiChoiceKeys = this.entityDefinition.fields.filter(
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

  entityDefinition!: EntityDefinition;

  _beforeInsert!: Array<EntityHookFunction>;

  _afterInsert!: Array<EntityHookFunction>;

  _beforeSave!: Array<EntityHookFunction>;

  _afterSave!: Array<EntityHookFunction>;

  _validate!: Array<EntityHookFunction>;

  _beforeValidate!: Array<EntityHookFunction>;

  _beforeDelete!: Array<EntityHookFunction>;

  _afterDelete!: Array<EntityHookFunction>;

  actions!: Record<string, EntityAction>;

  get _title(): string {
    const titleField = this.entityDefinition.config.titleField || "id";

    return this[titleField as keyof this] as string;
  }
  async beforeInsert() {
    this._data = this.setDefaultValues(this._data);
    for (const hook of this._beforeInsert) {
      await hook(this);
    }
    this.setCreatedAt();
  }
  async afterInsert() {
    for (const hook of this._afterInsert) {
      await hook(this);
    }
  }
  async beforeSave() {
    await this.getFetchedFields();
    for (const hook of this._beforeSave) {
      await hook(this);
    }
    this.setUpdatedAt();
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
      this.entityDefinition.config.tableName,
      idKey,
      id,
    );
    this._data = this.parseDatabaseRow(data);
    this._isNew = false;
    await this.loadMultiChoiceFields();
    await this.loadChildren();
  }

  private async loadChildren() {
    for (const child of this.entityDefinition.children) {
      const childClass = this[child.childName as keyof this] as ChildList;
      await childClass.load(this.id);
    }
  }

  private async loadMultiChoiceFields() {
    const fields = this.entityDefinition.fields.filter((field) =>
      field.fieldType === "MultiChoiceField"
    );

    for (const field of fields) {
      const values = await this.orm.database.getRows(
        `${this.entityDefinition.entityId}_${field.key}_mc_values`,
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
   * This method is used to save the entity to the database.
   * It returns the changed data.
   */
  async save(): Promise<Record<string, any> | undefined> {
    await this.validate();

    if (this._isNew) {
      await this.beforeInsert();
      await this.beforeSave();
      const changed = this.adaptChangedData(this._data);
      await this.orm.database.insertRow(
        this.entityDefinition.config.tableName,
        changed,
      );

      await this.saveChildren();
      await this.saveMultiChoiceFields();
      await this.afterInsert();
      await this.afterSave();
      this._isNew = false;
      this._prevData = {};
      await this.orm.runGlobalHook(
        "afterInsert",
        this.entityDefinition.entityId,
        this,
      );
      return changed;
    }
    await this.beforeSave();
    await this.saveMultiChoiceFields();
    await this.saveChildren();
    let changedData = this.getChangedData();

    if (!changedData) {
      return;
    }
    changedData = this.adaptChangedData(changedData);

    await this.orm.database.updateRow(
      this.entityDefinition.config.tableName,
      this.id,
      changedData,
    );

    await this.afterSave();
    this._prevData = {};
    this.entityDefinition.fields.forEach((field) => {
      if (field.hidden && field.key in changedData) {
        changedData[field.key] = "********";
      }
    });
    await this.orm.runGlobalHook(
      "afterChange",
      this.entityDefinition.entityId,
      this,
      changedData,
    );
    return changedData;
  }

  private changedChildren() {
    const childrenKeys = this.entityDefinition.children.map((child) =>
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
    const multiChoiceFields = this.entityDefinition.fields.filter(
      (field) => field.fieldType === "MultiChoiceField",
    );
    for (const field of multiChoiceFields) {
      const values = this[field.key as keyof this] as Record<string, any>[];
      await this.orm.database.deleteRows(
        `${this.entityDefinition.entityId}_${field.key}_mc_values`,
        {
          parentId: this.id,
        },
      );
      for (const value of values) {
        await this.orm.database.insertRow(
          `${this.entityDefinition.entityId}_${field.key}_mc_values`,
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
    const childrenKeys = this.entityDefinition.children.map((child) =>
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
      raiseOrmException("InvalidId", "Cannot delete entity without an id");
    }
    await this.beforeDelete();

    await this.deleteChildren();
    const idKey = this.primaryKey || "id";
    await this.orm.database.deleteRow(
      this.entityDefinition.config.tableName,
      idKey,
      this.id,
    );
    await this.afterDelete();
    await this.orm.runGlobalHook(
      "afterDelete",
      this.entityDefinition.entityId,
      this,
    );
  }

  update(data: Record<string, any>): void {
    const childKeys = this.entityDefinition.children.map((child) =>
      child.childName
    );
    for (const key in data) {
      if (childKeys.includes(key)) {
        this[key as keyof this] = data[key];
        continue;
      }
      if (!this.entityDefinition.fields.find((field) => field.key === key)) {
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

    const task = await this.orm.createEntity("taskQueue", {
      taskType: "entity",
      recordType: this.entityDefinition.entityId,
      recordId: this.id,
      recordTitle: this._title,
      action: actionKey,
      taskData: data,
    });
    return task.data;
  }

  private validateAction(actionKey: string, data?: Record<string, any>) {
    const action = this.actions[actionKey];
    if (!action) {
      raiseOrmException(
        "InvalidAction",
        `Action ${actionKey} not found in entity ${this.entityDefinition.entityId}`,
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
    const method = this.entityDefinition.config.idMethod;
    let id: string | number | null;
    switch (method.type) {
      case "hash":
        id = generateId(method.hashLength);
        break;
      case "number": {
        const result = await this.orm.database.getRows(
          this.entityDefinition.config.tableName,
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

    const childrenKeys = this.entityDefinition.children.map((child) =>
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
    this.entityDefinition.fields.forEach((field) => {
      if (field.key in row) {
        data[field.key] = this.orm.database.adaptLoadValue(
          field,
          row[field.key],
        );
      }
    });
    return data;
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
        const type = this.entityDefinition.config.idMethod.type;
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
            fieldType = this.entityDefinition.fields.find(
              (field) =>
                field.key ===
                  (this.entityDefinition.config.idMethod as FieldMethod).field,
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
      this.entityDefinition.fields.forEach((field) => {
        if (field.key === key) {
          fieldType = field.fieldType;
        }
      });

      if (!fieldType) {
        raiseOrmException(
          "InvalidField",
          `Field ${key} not found in entity ${this.entityDefinition.entityId}`,
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
      this.entityDefinition.entityId,
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
          target.entity,
          target.field as string,
          value,
          {
            [target.idKey]: this.id,
          },
        );
      }
    }
  }

  private async getFetchedFields() {
    // const titleFields = this.entityDefinition.fields.filter(
    //   (field) => field.connectionTitleField,
    // ).map((field) => field.connectionTitleField);
    const fields = this.entityDefinition.fields.filter((field) =>
      field.fetchOptions
    );
    for (const field of fields) {
      //  field.fetchOptions!.thisIdKey

      const { fetchEntity, thatFieldKey, thisFieldKey, thisIdKey } = field
        .fetchOptions!;

      const id = this[thisIdKey as keyof this] as string | undefined;

      if (!id) {
        this[thisFieldKey as keyof this] = null as any;
        continue;
      }
      this[thisFieldKey as keyof this] = await this.orm.getValue(
        fetchEntity,
        id,
        thatFieldKey,
      );
    }
  }

  private setDefaultValues(data: Record<PropertyKey, any>) {
    for (const field of this.entityDefinition.fields) {
      if (field.fieldType === "BooleanField" && isEmpty(data[field.key])) {
        data[field.key] = false;
        continue;
      }
      if (field.key in data && !isEmpty(data[field.key])) {
        continue;
      }

      if (field.defaultValue) {
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
        case "IntField":
          data[field.key] = 0;
          break;
        case "BigIntField":
          data[field.key] = 0;
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

    const fields = this.entityDefinition.fields.filter((field) =>
      field.fieldType === "ConnectionField" && keys.includes(field.key)
    );

    for (const field of fields) {
      if (
        !await this.orm.exists(field.connectionEntity!, changedData[field.key])
      ) {
        raiseOrmException(
          "InvalidConnection",
          `Invalid connection for field ${field.label} in entity ${this.entityDefinition.entityId}`,
        );
      }
    }
  }
}
