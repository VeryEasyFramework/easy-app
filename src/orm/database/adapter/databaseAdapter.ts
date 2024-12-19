import type {
  EasyField,
  EasyFieldType,
  IdMethodType,
  ListOptions,
  RowsResult,
} from "@vef/types";

export interface AdapterColumn {
  name: string;
  type: string;
  nullable: boolean;
  default: any;
  primaryKey: boolean;
  unique: boolean;
}
export abstract class DatabaseAdapter<C> {
  // require constructor with a config object
  protected config: C;
  constructor(config: C) {
    this.config = config;
  }
  query<T>(query: string): Promise<RowsResult<T>> {
    throw new Error("Method not implemented.");
  }
  abstract init(): Promise<void> | void;
  abstract connect(): Promise<void>;

  abstract disconnect(): Promise<void>;

  abstract createTable(
    tableName: string,
    idField: EasyField,
    idMethod: IdMethodType,
  ): Promise<void>;

  abstract addColumn(tableName: string, easyField: EasyField): Promise<void>;

  abstract getTableColumns(tableName: string): Promise<AdapterColumn[]>;

  abstract tableExists(tableName: string): Promise<boolean>;

  abstract dropTable(tableName: string): Promise<void>;

  abstract insert(
    tableName: string,
    data: Record<string, any>,
  ): Promise<any>;

  abstract update(
    tableName: string,
    id: any,
    fields: Record<string, any>,
  ): Promise<any>;

  abstract delete(tableName: string, field: string, value: any): Promise<void>;

  abstract getRows<T>(
    tableName: string,
    options?: ListOptions,
  ): Promise<RowsResult<T>>;

  abstract getRow<T>(tableName: string, field: string, value: any): Promise<T>;

  abstract getValue<T>(
    tableName: string,
    id: string,
    field: string,
  ): Promise<T>;

  abstract batchUpdateField(
    tableName: string,
    field: string,
    value: any,
    filters: Record<string, any>,
  ): Promise<void>;
  abstract adaptLoadValue(field: EasyField, value: any): any;

  abstract adaptSaveValue(field: EasyField | EasyFieldType, value: any): any;
}
