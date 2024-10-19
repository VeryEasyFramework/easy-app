import {
  PostgresAdapter,
  type PostgresConfig,
} from "#orm/database/adapter/adapters/pgAdapter.ts";

import type { DatabaseAdapter } from "./adapter/databaseAdapter.ts";
import type {
  CountOptions,
  EasyField,
  EasyFieldType,
  ListOptions,
  ReportOptions,
  RowsResult,
  SafeType,
} from "@vef/types";
import {
  DenoKvAdapter,
  type DenoKvConfig,
} from "#orm/database/adapter/adapters/denoKvAdapter.ts";

export interface DatabaseConfig {
  postgres: PostgresConfig;
  denoKv: DenoKvConfig;
}

export type DBType = keyof DatabaseConfig;

export interface AdapterMap {
  "postgres": PostgresAdapter;

  "denoKv": DenoKvAdapter;
}

type ExtractConfig<A extends keyof DatabaseConfig> = A extends
  keyof DatabaseConfig ? DatabaseConfig[A] : never;

export class Database<
  A extends keyof DatabaseConfig,
> {
  adapter: PostgresAdapter;
  private config: DatabaseConfig[A];
  constructor(options: {
    adapter: A;
    config: DatabaseConfig[A];
    idFieldType?: EasyFieldType;
  }) {
    this.config = options.config;
    switch (options.adapter) {
      case "postgres":
        this.adapter = new PostgresAdapter(
          options.config as PostgresConfig,
        );
        break;

      default:
        throw new Error("Invalid adapter");
    }
  }

  async init() {
    await this.adapter.init();
  }
  async connect(): Promise<void> {
    await this.adapter.connect();
  }
  async disconnect(): Promise<void> {
    await this.adapter.disconnect();
  }

  stop() {
    this.adapter.disconnect();
  }
  adaptLoadValue(field: EasyField, value: any): any {
    return this.adapter.adaptLoadValue(field, value);
  }
  adaptSaveValue(field: EasyField | EasyFieldType, value: any): any {
    return this.adapter.adaptSaveValue(field, value);
  }
  async insertRow<T>(
    tableName: string,
    data: Record<string, any>,
  ): Promise<T> {
    return await this.adapter.insert(tableName, data);
  }
  async updateRow<T>(
    tableName: string,
    id: any,
    data: Record<string, any>,
  ): Promise<RowsResult<T>> {
    return await this.adapter.update<T>(tableName, id, data);
  }
  async deleteRow(
    tableName: string,
    field: string,
    value: any,
  ): Promise<void> {
    await this.adapter.delete(tableName, field, value);
  }

  async deleteRows(
    tableName: string,
    filters: Record<string, any>,
  ): Promise<void> {
    await this.adapter.deleteRows(tableName, filters);
  }
  async getRows<T extends Record<string, SafeType>>(
    tableName: string,
    options?: ListOptions,
  ): Promise<RowsResult<T>> {
    if (options?.filter) {
      const keys = Object.keys(options.filter);
      if (keys.length == 0) {
        options.filter = undefined;
      }
    }
    return await this.adapter.getRows(tableName, options);
  }
  async getRow<T extends Record<string, SafeType>>(
    tableName: string,
    field: string,
    value: any,
  ): Promise<T> {
    return await this.adapter.getRow(tableName, field, value);
  }

  async getValue<SafeType>(
    tableName: string,
    id: string,
    field: string,
  ): Promise<SafeType> {
    return await this.adapter.getValue(tableName, id, field);
  }

  async count(tableName: string, options?: CountOptions): Promise<number> {
    return await this.adapter.count(tableName, options) as number;
  }

  async countGrouped<K extends Array<PropertyKey>>(
    tableName: string,
    groupBy: K,
    options?: CountOptions,
  ): Promise<any> {
    return await this.adapter.count(tableName, {
      ...options,
      groupBy,
    });
  }

  async getReport<T>(
    tableName: string,
    options: ReportOptions,
  ) {
    const results = await this.adapter.getReport(tableName, options);
    return results;
  }
  async batchUpdateField(
    tableName: string,
    field: string,
    value: any,
    filters: Record<string, any>,
  ) {
    await this.adapter.batchUpdateField(tableName, field, value, filters);
  }
}
