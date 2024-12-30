import type { ChildListDefinition, EasyField } from "@vef/types";
import type { EasyOrm } from "#orm/orm.ts";
import { generateId } from "#orm/utils/misc.ts";

export class ChildRecord {
  id?: string;
  parentId?: string;
  order?: number;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}

export class ChildList<T extends Record<string, any> = any> {
  _records: Array<ChildRecord & T> = [];
  fields: Map<string, EasyField>;

  get records(): Array<ChildRecord & T> {
    return this._records;
  }

  set records(value: Array<Record<string, any>>) {
    this._records = [];
    for (const record of value) {
      this._records.push(this.sanitizeRecord(record));
    }
    this.changed = true;
  }

  sanitizeRecord(record: Record<string, any>): ChildRecord & T {
    const data: Record<string, any> = {};
    for (const key in record) {
      if (this.hasField(key) || ["id", "parentId", "order"].includes(key)) {
        data[key] = record[key];
      }
    }
    const newChild = new ChildRecord(data);
    newChild.parentId = this.parentId;
    return newChild as ChildRecord & T;
  }
  orm: EasyOrm;
  childDefinition!: ChildListDefinition;
  parentId: string;
  private tableName!: string;

  changed: boolean = false;

  constructor(orm: EasyOrm, childDefinition: ChildListDefinition) {
    this.orm = orm;
    this.childDefinition = childDefinition;
    this.tableName = childDefinition.config!.tableName;
    this.parentId = "";

    this.fields = new Map(childDefinition.fields.map((f) => [f.key, f]));
  }

  hasField(key: string): boolean {
    return this.fields.has(key);
  }
  async load(parentId: string) {
    this.parentId = parentId;
    this.changed = false;
    this._records = [];
    const result = await this.orm.database.getRows(this.tableName, {
      filter: {
        parentId,
      },
      orderBy: "order",
    });

    this._records = result.data.map((row) =>
      new ChildRecord(row) as ChildRecord & T
    );
  }

  async addRecord(data: Record<string, any>) {
  }
  async updateOrder() {
  }

  async clear() {
    await this.orm.database.deleteRows(this.tableName, {
      parentId: this.parentId,
    });

    await this.load(this.parentId);
  }

  private async deleteStaleRecords() {
    const dbRecords = this.orm.database.getRows(this.tableName, {
      filter: {
        parentId: this.parentId,
      },
      orderBy: "order",
      columns: ["id"],
    });

    const dbIds = (await dbRecords).data.map((row) => row.id as string);
    const staleIds = dbIds.filter((id) =>
      !this.records.some((r) => r.id === id)
    );
    for (const id of staleIds) {
      await this.orm.database.deleteRow(this.tableName, "id", id);
    }
  }

  async save() {
    for (const record of this.records) {
      record.parentId = this.parentId;
      if (record.id) {
        await this.orm.database.updateRow(this.tableName, record.id, record);
      } else {
        record.id = generateId(16);
        await this.orm.database.insertRow(this.tableName, record);
      }
    }

    await this.deleteStaleRecords();
    this.changed = false;
    this.load(this.parentId);
  }
}
