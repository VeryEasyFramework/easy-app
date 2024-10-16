import {
  type AdapterColumn,
  DatabaseAdapter,
  type RowsResult,
} from "#orm/database/adapter/databaseAdapter.ts";
import type { EasyFieldType } from "#orm/entity/field/fieldTypes.ts";
import type { EntityDefinition } from "#orm/entity/entity/entityDefinition/entityDefTypes.ts";
import type { ListOptions } from "#orm/database/database.ts";
import type { EasyField } from "#orm/entity/field/easyField.ts";
import { raiseOrmException } from "#orm/ormException.ts";

export interface DenoKvConfig {
  path?: string;
}
export class DenoKvAdapter extends DatabaseAdapter<DenoKvConfig> {
  getValue<T>(tableName: string, id: string, field: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  kv!: Deno.Kv;

  async init(): Promise<void> {
    this.config.path = this.config.path || ".data/kv.db";
    const path = this.config.path.split("/")
      .slice(0, -1)
      .join("/");

    Deno.mkdirSync(path, { recursive: true });
    this.kv = await Deno.openKv(this.config.path);
  }
  async connect(): Promise<void> {
  }
  async disconnect(): Promise<void> {
  }
  async createTable(tableName: string): Promise<void> {
    await this.kv.set(["_tables", tableName], {
      columns: [],
    });
  }
  async getTableColumns(tableName: string): Promise<AdapterColumn[]> {
    const result = await this.kv.get<{
      columns: AdapterColumn[];
    }>(["_tables", tableName]);
    return result.value?.columns || [];
  }
  async addColumn(tableName: string, easyField: EasyField): Promise<void> {
    const result = await this.kv.get<{
      columns: AdapterColumn[];
    }>(["_tables", tableName]);
    const columns = result.value?.columns || [];
    columns.push({
      name: easyField.key as string,
      default: easyField.defaultValue,
      nullable: !easyField.required,
      primaryKey: easyField.primaryKey || false,
      type: easyField.fieldType,
      unique: easyField.unique || false,
    });
    await this.kv.set(["_tables", tableName], {
      columns,
    });
    const tableById = `${tableName}:id`;
    const tableByField = `${tableName}:${easyField.key as string}`;
    await this.kv.set([tableById], {});
  }
  async tableExists(tableName: string): Promise<boolean> {
    const result = await this.kv.get<any>([tableName]);
    return result.value !== undefined;
  }
  async dropTable(tableName: string): Promise<void> {
    await this.kv.delete([tableName]);
  }
  async insert(
    tableName: string,
    data: Record<string, any>,
  ): Promise<any> {
    const keys = Object.keys(data);
    const id = data.id;
    await this.kv.set([`${tableName}:id`, id], data);
    for (const key of keys) {
      await this.kv.set([`${tableName}:${id}`, key], data[key]);
    }
  }
  async update(
    tableName: string,
    id: any,
    fields: Record<string, any>,
  ): Promise<any> {
  }
  async delete(tableName: string, field: string, value: any): Promise<void> {
  }
  async getRows<T>(
    tableName: string,
    options?: ListOptions,
  ): Promise<RowsResult<T>> {
    const rows = [];
    const columns: Record<string, boolean> = {};
    options = options || {} as ListOptions;
    const result = this.kv.list<T>({
      prefix: [`${tableName}:id`],
    });
    for await (const { key, value } of result) {
      const id = key[1];
      const ckeys = Object.keys(value as Record<string, any>);
      ckeys.forEach((k) => {
        columns[k] = true;
      });

      rows.push(value);
    }
    return {
      data: rows,
      rowCount: rows.length,
      totalCount: rows.length,
      columns: Object.keys(columns),
    };
  }

  async getRow<T>(tableName: string, field: string, value: any): Promise<T> {
    const tableByField = `${tableName}:${field}`;
    const tableById = `${tableName}:id`;
    const result = await this.kv.get<T>([`${tableName}:id`, value]);
    if (!result.versionstamp) {
      raiseOrmException(
        "EntityNotFound",
        `Row not found: ${tableName}:${field}:${value}`,
      );
    }
    // const record = await this.kv.get<T>([tableById, result.value]);
    // if (!record.versionstamp) {
    //   raiseOrmException(
    //     "EntityNotFound",
    //     `Row not found: ${tableName}:${field}:${value}`,
    //   );
    // }
    return result.value;
  }
  async batchUpdateField(
    tableName: string,
    field: string,
    value: any,
    filters: Record<string, any>,
  ): Promise<void> {
  }
  async adaptLoadValue(field: EasyField, value: any) {
  }
  async adaptSaveValue(field: EasyField | EasyFieldType, value: any) {
  }
  async syncTable(
    tableName: string,
    entity: EntityDefinition,
  ): Promise<string> {
    return "";
  }
}
