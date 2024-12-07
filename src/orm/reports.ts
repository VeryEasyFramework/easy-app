import type { AdvancedFilter, ListOptions } from "@vef/types";

export interface ReportOptions {
  columns?: string[];
  subGroup?: string;

  join?: {
    entryType: string;
    type: "inner" | "left" | "right";
    columns: string[];
  };
  filter?: Record<string, string | number | AdvancedFilter>;
  orFilter?: Record<string, string | number | AdvancedFilter>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface ReportColumn {
  name: string;
  order?: number;
  aggregate?: boolean;
  alias?: string;
  operation?: "sum" | "avg" | "count" | "min" | "max";
}

export interface CountOptions {
  filter?: Record<string, string | number | AdvancedFilter>;
  orFilter?: Record<string, string | number | AdvancedFilter>;
}

export interface ReportResult<T = Record<string, any>> {
  rowCount: number;
  totalCount: number;
  data: T[];

  columns: string[];
}

export type CountGroupedResult<K extends string | Array<PropertyKey>> =
  K extends Array<string> ? { [key in K[number]]: string }
    : K extends string ? Record<K, string>
    : never;
