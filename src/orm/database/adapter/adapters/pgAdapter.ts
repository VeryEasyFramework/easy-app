import type {
  AdvancedFilter,
  DatabaseListOptions,
  EasyField,
  EasyFieldType,
  IdMethodType,
  ListOptions,
  RowsResult,
  SafeType,
} from "@vef/types";
import {
  type AdapterColumn,
  DatabaseAdapter,
} from "#orm/database/adapter/databaseAdapter.ts";
import { camelToSnakeCase, toCamelCase } from "@vef/string-utils";
import { PostgresPool } from "#orm/database/adapter/adapters/postgres/pgPool.ts";
import type { PgClientConfig } from "#orm/database/adapter/adapters/postgres/pgTypes.ts";
import { raiseOrmException } from "#orm/ormException.ts";
import { easyLog } from "#/log/logging.ts";
import type { DatabaseReportOptions } from "#orm/database/database.ts";
import type {
  CountGroupedResult,
  CountOptions,
  ReportResult,
} from "#orm/reports.ts";

export interface PostgresConfig {
  clientOptions: PgClientConfig;
  size: number;
  lazy?: boolean;
  schema?: string;
  debug?: boolean;
}

interface PostgresColumn {
  columnName: string;
  dataType: string;
  columnDefault: any;
  isNullable: string;
  isIdentity: string;
}
export class PostgresAdapter extends DatabaseAdapter<PostgresConfig> {
  // columns: AdapterColumn[];
  // name: string;
  // type: string;
  // nullable: boolean;
  // default: any;
  // primaryKey: boolean;
  // unique: boolean;

  private pool!: PostgresPool;
  camelCase: boolean = true;

  schema: string = "public";

  toSnake(value: string): string {
    return camelToSnakeCase(value);
  }
  async init(): Promise<void> {
    this.pool = new PostgresPool(this.config);
    await this.pool.initialized();
  }

  async connect(): Promise<void> {
  }
  async disconnect(): Promise<void> {
  }
  override async query<T>(query: string): Promise<RowsResult<T>> {
    if (this.config.debug) {
      easyLog.debug(query, "Postgres Query");
    }
    const result = await this.pool.query<T>(query);
    const columns = result.columns.map((column) => {
      return this.camelCase ? column.camelName : column.name;
    });
    return {
      rowCount: result.rowCount,
      totalCount: result.rowCount,
      data: result.rows,
      columns: columns,
    };
  }

  async getTableColumns(tableName: string): Promise<AdapterColumn[]> {
    tableName = this.toSnake(tableName);
    const query =
      `SELECT column_name, data_type, column_default, is_nullable, is_identity FROM information_schema.columns WHERE table_schema = '${this.schema}' AND table_name = '${tableName}'`;
    const result = await this.query<PostgresColumn>(query);
    return result.data.map((column) => {
      return {
        name: toCamelCase(column.columnName),
        type: column.dataType,
        nullable: column.isNullable === "YES",
        default: column.columnDefault,
        primaryKey: column.isIdentity === "YES",
        unique: false,
      };
    });
  }
  async addColumn(tableName: string, easyField: EasyField): Promise<void> {
    tableName = this.toSnake(tableName);
    const columnName = camelToSnakeCase(easyField.key as string);
    const columnType = this.getColumnType(easyField);
    const query =
      `ALTER TABLE ${this.schema}.${tableName} ADD "${columnName}" ${columnType}`;
    // return query;
    await this.query(query);
  }
  async tableExists(tableName: string): Promise<boolean> {
    tableName = this.toSnake(tableName);
    const query =
      `SELECT table_name FROM information_schema.tables WHERE table_schema = '${this.schema}' AND table_name = '${tableName}'`;
    const result = await this.query<{ tableName: string }>(query);
    return result.rowCount > 0;
  }
  async createTable(
    tableName: string,
    idField: EasyField,
    idMethod: IdMethodType,
  ): Promise<void> {
    tableName = this.toSnake(tableName);
    const columnName = this.formatColumnName(idField.key as string);
    let columnType = "";
    switch (idMethod.type) {
      case "number":
        if (idMethod.autoIncrement) {
          columnType = "SERIAL";
        } else {
          columnType = "INTEGER";
        }
        break;
      case "hash":
        columnType = `VARCHAR(${idMethod.hashLength})`;
        break;
      case "uuid":
        columnType = "UUID";
        break;
      case "series":
        columnType = "SERIAL";
        break;
      case "data":
        columnType = "VARCHAR(255)";
        break;
      case "field":
        columnType = "VARCHAR(255)";
        break;
      default:
        columnType = "VARCHAR(255)";
        break;
    }

    const query =
      `CREATE TABLE IF NOT EXISTS ${this.schema}.${tableName} (${columnName} ${columnType} PRIMARY KEY)`;
    await this.query<any>(query);
  }
  dropTable(tableName: string): Promise<void> {
    tableName = this.toSnake(tableName);
    throw new Error(`dropTable not implemented for postgres`);
  }

  async insert(
    tableName: string,
    data: Record<string, any>,
  ): Promise<any> {
    tableName = this.toSnake(tableName);
    const columnKeys = Object.keys(data);
    const columns = columnKeys.map((key) => {
      return this.formatColumnName(key);
    });

    const values = columnKeys.map((key) => {
      return formatValue(data[key]);
    });
    const query = `INSERT INTO ${this.schema}.${tableName} (${
      columns.join(", ")
    }) VALUES (${values.join(", ")}) RETURNING *`;
    return await this.query(query);
  }

  async delete(tableName: string, field: string, value: any): Promise<void> {
    tableName = this.toSnake(tableName);
    const query = `DELETE FROM ${this.schema}.${tableName} WHERE ${
      this.formatColumnName(field)
    } = ${formatValue(value)}`;
    await this.query(query);
  }

  async deleteRows(
    tableName: string,
    filters?: Record<string, any>,
  ): Promise<void> {
    tableName = this.toSnake(tableName);
    let query = `DELETE FROM ${this.schema}.${tableName}`;
    if (filters) {
      query += " WHERE ";
      query += this.makeFilter(filters);
    }
    await this.query(query);
  }
  async update<T>(
    tableName: string,
    id: string | number,
    data: Record<string, any>,
  ): Promise<RowsResult<T>> {
    tableName = this.toSnake(tableName);
    const values = Object.entries(data).map(([key, value]) => {
      return `${this.formatColumnName(key)} = ${formatValue(value)}`;
    });
    const idValue = formatValue(id);

    const query = `UPDATE ${this.schema}.${tableName} SET ${
      values.join(", ")
    } WHERE id = ${idValue} RETURNING *`;
    return await this.query<T>(query);
  }

  async getRows<T>(
    tableName: string,
    options?: DatabaseListOptions,
  ): Promise<RowsResult<T>> {
    tableName = this.toSnake(tableName);
    if (!options) {
      options = {} as ListOptions;
    }
    let columns = "*";
    if (options.columns && Array.isArray(options.columns)) {
      columns = options.columns.map((column) => {
        if (typeof column === "object") {
          return this.makeMultiChoiceFieldQuery(
            this.schema,
            tableName,
            column.entryType,
            column.key,
          );
        }
        return this.formatColumnName(column);
      }).join(", ");
    }
    let query = `SELECT ${columns} FROM ${this.schema}.${tableName}`;
    let countQuery = `SELECT COUNT(*) FROM ${this.schema}.${tableName}`;
    let andFilter = "";
    let orFilter = "";
    if (options.filter) {
      andFilter = this.makeAndFilter(options.filter);
    }
    if (options.orFilter) {
      orFilter = this.makeOrFilter(options.orFilter);
    }
    if (andFilter && orFilter) {
      query += ` WHERE ${andFilter} AND (${orFilter})`;
      countQuery += ` WHERE ${andFilter} AND (${orFilter})`;
    } else if (andFilter) {
      query += ` WHERE ${andFilter}`;
      countQuery += ` WHERE ${andFilter}`;
    } else if (orFilter) {
      query += ` WHERE ${orFilter}`;
      countQuery += ` WHERE ${orFilter}`;
    }

    if (options.orderBy) {
      query += ` ORDER BY ${this.formatColumnName(options.orderBy)}`;
      const order = options.order || "ASC";
      query += ` ${order}`;
    }

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    if (options.offset) {
      query += ` OFFSET ${options.offset}`;
    }
    const result = await this.query<T>(query);
    result.totalCount = result.rowCount;
    if (options.limit) {
      const countResult = await this.query<{ count: number }>(countQuery);
      result.totalCount = countResult.data[0].count;
    }

    return result;
  }

  async count<K extends Array<PropertyKey>>(
    tableName: string,
    options?: CountOptions & { groupBy?: K },
  ): Promise<any> {
    tableName = this.toSnake(tableName);
    let countQuery = `SELECT COUNT(*) FROM ${this.schema}.${tableName}`;
    if (options?.groupBy) {
      countQuery = `SELECT ${
        options.groupBy.map((column) => {
          return this.formatColumnName(column as string);
        }).join(", ")
      }, COUNT(*) FROM ${this.schema}.${tableName}`;
    }
    let andFilter = "";
    let orFilter = "";
    if (options?.filter) {
      andFilter = this.makeAndFilter(options.filter);
    }
    if (options?.orFilter) {
      orFilter = this.makeOrFilter(options.orFilter);
    }
    if (andFilter && orFilter) {
      countQuery += ` WHERE ${andFilter} AND (${orFilter})`;
    } else if (andFilter) {
      countQuery += ` WHERE ${andFilter}`;
    } else if (orFilter) {
      countQuery += ` WHERE ${orFilter}`;
    }
    if (options?.groupBy) {
      countQuery += ` GROUP BY ${
        options.groupBy.map((column) => {
          return this.formatColumnName(column as string);
        }).join(", ")
      }`;
      const groupedResult = await this.query<CountGroupedResult<K>>(countQuery);
      return groupedResult.data;
    }
    const countResult = await this.query<{ count: number }>(countQuery);
    return countResult.data[0].count;
  }
  private formatColumnName(column: string): string {
    column = camelToSnakeCase(column);
    const reservedWords = ["order", "user"];
    if (reservedWords.includes(column)) {
      return `"${column}"`;
    }
    return column;
  }
  async getRow<T>(tableName: string, field: string, value: any): Promise<T> {
    tableName = this.toSnake(tableName);
    if (this.camelCase) {
      field = this.formatColumnName(field);
    }
    value = formatValue(value);
    const query =
      `SELECT * FROM ${this.schema}.${tableName} WHERE ${field} = ${value}`;
    const result = await this.query<T>(query);
    if (result.rowCount === 0) {
      raiseOrmException(
        "EntryTypeNotFound",
        `No row found with ${field} = ${value} for table ${tableName}`,
      );
    }
    return result.data[0];
  }
  async getValue<T>(
    tableName: string,
    id: string,
    field: string,
  ): Promise<T> {
    tableName = this.toSnake(tableName);
    const query = `SELECT ${
      this.formatColumnName(field)
    } FROM ${this.schema}.${tableName} WHERE id = ${formatValue(id)}`;
    const result = await this.query<Record<string, T>>(query);
    if (result.rowCount === 0) {
      raiseOrmException(
        "EntryTypeNotFound",
        `No row found with id = ${id} for table ${tableName}`,
      );
    }
    return result.data[0][field];
  }

  async getReport<T>(
    tableName: string,
    options: DatabaseReportOptions,
  ): Promise<ReportResult<T>> {
    tableName = this.toSnake(tableName);
    const baseTableAlias = "A";
    const joinTableAlias = "B";
    const aColumns = options.columns.map((column) => {
      return `${baseTableAlias}.${this.formatColumnName(column)}`;
    });

    const bColumns = options.joinTable?.columns.map((column) => {
      const columnName = this.formatColumnName(column.alias || column.name);
      let fullColumn = `${joinTableAlias}.${columnName}`;
      if (column.aggregate) {
        if (options.subGroup) {
          fullColumn = `${column.aggregate.toUpperCase()}(${fullColumn})`;
        }
        return `COALESCE(${fullColumn}, 0) as ${columnName}`;
      }
      return fullColumn;
    });

    const columns = [...aColumns, ...(bColumns || [])].join(", ");
    let query =
      `SELECT ${columns} FROM ${this.schema}.${tableName} ${baseTableAlias}`;
    let countQuery =
      `SELECT COUNT(*) FROM ${this.schema}.${tableName} ${baseTableAlias}`;
    if (options.joinTable) {
      const joinTableName = this.toSnake(options.joinTable.tableName);
      const joinColumn = this.formatColumnName(options.joinTable.joinColumn);
      const joinType = options.joinTable.type.toUpperCase();

      const joinColumns = [
        joinColumn,
        ...options.joinTable.columns.map((column) => {
          const columnName = this.formatColumnName(column.name);
          const columnAlias = this.formatColumnName(
            column.alias || column.name,
          );
          if (column.aggregate) {
            return `${column.aggregate.toUpperCase()}(${columnName}) as ${columnAlias}`;
          }
        }),
      ].join(", ");
      let joinFilter = "";
      if (options.joinTable.filter) {
        joinFilter = this.makeAndFilter(options.joinTable.filter);
        if (joinFilter) {
          joinFilter = ` WHERE ${joinFilter}`;
        }
      }
      const joinQuery =
        ` ${joinType} JOIN ( SELECT ${joinColumns} FROM ${this.schema}.${joinTableName}${joinFilter} GROUP BY ${joinColumn} ) ${joinTableAlias} ON ${joinTableAlias}.${joinColumn}= ${baseTableAlias}.id`;
      query += joinQuery;
    }

    let andFilter = "";
    let orFilter = "";
    if (options.filter) {
      andFilter = this.makeAndFilter(options.filter);
    }
    if (options.orFilter) {
      orFilter = this.makeOrFilter(options.orFilter);
    }
    if (andFilter && orFilter) {
      query += ` WHERE ${andFilter} AND (${orFilter})`;
      countQuery += ` WHERE ${andFilter} AND (${orFilter})`;
    } else if (andFilter) {
      query += ` WHERE ${andFilter}`;
      countQuery += ` WHERE ${andFilter}`;
    } else if (orFilter) {
      query += ` WHERE ${orFilter}`;
      countQuery += ` WHERE ${orFilter}`;
    }

    if (options.orderBy) {
      query += ` ORDER BY ${this.formatColumnName(options.orderBy)}`;
      const order = options.order || "ASC";
      query += ` ${order}`;
    }
    if (options.subGroup) {
      query += ` GROUP BY ${aColumns.join(", ")}`;
    }
    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    if (options.offset) {
      query += ` OFFSET ${options.offset}`;
    }
    const result = await this.query<T>(query);
    result.totalCount = result.rowCount;
    if (options.limit) {
      const countResult = await this.query<{ count: number }>(countQuery);
      result.totalCount = countResult.data[0].count;
    }
    return result;
  }
  private makeFilter(
    filters: Record<string, SafeType | AdvancedFilter>,
  ): string[] {
    const keys = Object.keys(filters);
    if (keys.length === 0) {
      return [];
    }

    const filterStrings = keys.map((key) => {
      let filterString = "";
      const column = this.formatColumnName(key);

      if (typeof filters[key] === "object") {
        const filter = filters[key] as AdvancedFilter;

        const operator = filter.op;
        const joinList = !(operator === "between" || operator === "notBetween");
        const value = formatValue(filter.value, joinList);
        if (!value) {
          return "";
        }
        switch (operator) {
          case "=":
            filterString = `${column} = ${value}`;
            break;
          case "!=":
            filterString = `${column} != ${value}`;
            break;
          case ">":
            filterString = `${column} > ${value}`;
            break;
          case "<":
            filterString = `${column} < ${value}`;
            break;
          case ">=":
            filterString = `${column} >= ${value}`;
            break;
          case "<=":
            filterString = `${column} <= ${value}`;
            break;
          case "is":
            filterString = `${column} IS ${value}`;
            break;
          case "isNot":
            filterString = `${column} IS NOT ${value}`;
            break;

          case "contains":
            filterString = `${column} ILIKE '%${
              formatValue(filter.value, false, true)
            }%'`;
            break;
          case "notContains":
            filterString = `${column} NOT ILIKE '%${
              formatValue(filter.value, false, true)
            }%'`;
            break;
          case "startsWith":
            filterString = `${column} ILIKE '${
              formatValue(filter.value, false, true)
            }%'`;
            break;
          case "endsWith":
            filterString = `${column} ILIKE '%${
              formatValue(filter.value, false, true)
            }'`;
            break;
          case "isEmpty":
            filterString = `${column} IS NULL`;
            break;
          case "isNotEmpty":
            filterString = `${column} IS NOT NULL`;
            break;
          case "inList":
            filterString = `${column} IN (${value})`;
            break;
          case "notInList":
            filterString = `${column} NOT IN (${value})`;
            break;
          case "equal":
            filterString = `${column} = ${value}`;
            break;
          case "greaterThan":
            filterString = `${column} > ${value}`;
            break;
          case "lessThan":
            filterString = `${column} < ${value}`;
            break;
          case "greaterThanOrEqual":
            filterString = `${column} >= ${value}`;
            break;
          case "lessThanOrEqual":
            filterString = `${column} <= ${value}`;
            break;
          case "between":
            {
              const val = value as string[];
              filterString = `${column} BETWEEN ${val[0]} AND ${val[1]}`;
            }
            break;
          case "notBetween":
            {
              const val = value as string[];
              filterString = `${column} NOT BETWEEN ${val[0]} AND ${val[1]}`;
            }
            break;
          default:
            filterString = `${column} = ${value}`;
            break;
        }
        return filterString;
      }
      return `${column} = ${formatValue(filters[key])}`;
    });

    return filterStrings.filter((filter) => filter !== "");
  }

  private makeOrFilter(
    filters: Record<string, SafeType | AdvancedFilter>,
  ) {
    const filterStrings = this.makeFilter(filters);
    return filterStrings.join(" OR ");
  }
  private makeAndFilter(
    filters: Record<string, SafeType | AdvancedFilter>,
  ) {
    const filterStrings = this.makeFilter(filters);
    return filterStrings.join(" AND ");
  }
  async batchUpdateField(
    tableName: string,
    field: string,
    value: any,
    filters: Record<string, any>,
  ): Promise<void> {
    tableName = this.toSnake(tableName);
    let query = `UPDATE ${this.schema}.${tableName} SET ${
      this.formatColumnName(field)
    } = ${formatValue(value)}`;
    if (filters) {
      query += " WHERE ";
      query += this.makeFilter(filters);
    }
    await this.query(query);
  }

  getColumnType(field: EasyField): string {
    switch (field.fieldType as EasyFieldType) {
      case "BooleanField":
        return "BOOLEAN";
      case "DateField":
        return "DATE";
      case "IntField":
        return "INTEGER";
      case "BigIntField":
        return "BIGINT";
      case "DecimalField":
        return "DECIMAL";
      case "CurrencyField":
        return "DECIMAL";
      case "DataField":
        return "VARCHAR(255)";
      case "JSONField":
        return "JSONB";
      case "RichTextField":
        return "JSONB";
      case "EmailField":
        return "TEXT";
      case "ImageField":
        return "TEXT";
      case "TextField":
        return "TEXT";
      case "ChoicesField":
        return "TEXT";
      case "MultiChoiceField":
        return "TEXT";
      case "PasswordField":
        return "TEXT";
      case "PhoneField":
        return "TEXT";
      case "ConnectionField":
        return "TEXT";
      case "TimeStampField":
        return "TIMESTAMP WITH TIME ZONE";
      case "IDField":
        return "VARCHAR(255)";
      case "URLField":
        return "TEXT";
      case "ListField":
        return "JSONB";
      default:
        return "TEXT";
    }
  }
  adaptLoadValue(field: EasyField, value: any): any {
    switch (field.fieldType as EasyFieldType) {
      case "BooleanField":
        break;
      case "DateField":
        break;
      case "IntField":
        break;
      case "BigIntField":
        break;
      case "DecimalField":
        break;
      case "CurrencyField":
        break;
      case "DataField":
        break;
      case "JSONField":
        if (typeof value === "string") {
          value = JSON.parse(value);
        }
        if (typeof value === "object") {
          break;
        }
        value = JSON.parse(value);
        break;
      case "RichTextField":
        if (typeof value === "string") {
          value = JSON.parse(value);
        }
        if (typeof value === "object") {
          break;
        }
        value = JSON.parse(value);
        break;
      case "EmailField":
        break;
      case "ImageField":
        break;
      case "TextField":
        break;
      case "ChoicesField":
        break;
      case "MultiChoiceField":
        break;
      case "PasswordField":
        break;
      case "PhoneField":
        break;
      case "URLField":
        break;
      case "ConnectionField":
        break;
      case "TimeStampField": {
        if (value === null) {
          break;
        }
        const date = new Date(value);
        if (date.toString() === "Invalid Date") {
          return null;
        }
        value = date.getTime();

        break;
      }
      default:
        break;
    }
    return value;
  }
  adaptSaveValue(field: EasyField | EasyFieldType, value: any): any {
    const fieldType = typeof field === "string" ? field : field.fieldType;

    switch (fieldType as EasyFieldType) {
      case "BooleanField":
        if (value === null) {
          return false;
        }
        break;
      case "DateField":
        break;

      case "URLField":
        break;

      case "IntField":
        break;
      case "BigIntField":
        break;
      case "DecimalField":
        break;
      case "CurrencyField":
        break;
      case "DataField":
        break;
      case "JSONField":
        value = value ? JSON.stringify(value) : null;
        break;
      case "RichTextField":
        value = value ? JSON.stringify(value) : null;
        break;
      case "EmailField":
        break;
      case "ImageField":
        break;
      case "TextField":
        break;
      case "ChoicesField":
        break;
      case "MultiChoiceField":
        break;
      case "PasswordField":
        break;
      case "PhoneField":
        break;
      case "ConnectionField":
        break;
      case "TimeStampField":
        if (value === null) {
          break;
        }
        value = new Date(value).toUTCString();

        if (value === "Invalid Date") {
          value = null;
        }
        break;
      case "ListField":
        value = JSON.stringify(value || []);
        break;
      default:
        break;
    }
    return value;
  }

  makeMultiChoiceFieldQuery(
    schema: string,
    parentTableName: string,
    entryType: string,
    fieldName: string,
  ): string {
    return `(SELECT string_agg(values.value, ', ') 
    FROM (SELECT value FROM ${schema}.${entryType}_${fieldName}_mc_values WHERE parent_id = ${schema}.${parentTableName}.id) AS values) AS ${fieldName}`;
  }
}

type ValueType<Join> = Join extends false ? Array<string> : string | number;
function formatValue<Join extends boolean>(
  value: any,
  joinList?: Join,
  noQuotes?: boolean,
): ValueType<Join> | undefined {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return;
    }
    if (joinList) {
      return value.map((v) => formatValue(v)).join(", ") as ValueType<Join>;
    }
    return value.map((v) => formatValue(v)) as ValueType<Join>;
  }
  if (value === '"') {
    return '""' as ValueType<Join>;
  }
  if (typeof value === "string") {
    if (value === "") {
      return "''" as ValueType<Join>;
    }
    // escape single quotes

    value = value.replaceAll(/'/g, "''");
    if (noQuotes) {
      return value as ValueType<Join>;
    }
    return `'${value}'` as ValueType<Join>;
  }
  if (value === false) {
    return "false" as ValueType<Join>;
  }
  if (typeof value === "number") {
    return value as ValueType<Join>;
  }
  if (!value) {
    return "null" as ValueType<Join>;
  }
  return value;
}
