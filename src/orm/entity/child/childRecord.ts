import type { ChildListDefinition } from "@vef/types";
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

export class ChildList {
  _records: ChildRecord[] = [];

  get records() {
    return this._records;
  }

  set records(value: ChildRecord[]) {
    this._records = value;
    this.changed = true;
  }
  orm: EasyOrm;
  childDefinition!: ChildListDefinition;
  parentId!: string;
  private tableName!: string;

  changed: boolean = false;

  constructor(orm: EasyOrm, childDefinition: ChildListDefinition) {
    this.orm = orm;
    this.childDefinition = childDefinition;
    this.tableName = childDefinition.config!.tableName;
  }

  async load(parentId: string) {
    this.parentId = parentId;
    this.changed = false;
    this._records = [];
    const result = this.orm.database.getRows(this.tableName, {
      filter: {
        parentId,
      },
      orderBy: "order",
    });

    this._records = (await result).data.map((row) => new ChildRecord(row));
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
