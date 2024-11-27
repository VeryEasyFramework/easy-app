import type { AdvancedFilter } from "@vef/types";

export interface ReportOptions {
  baseEntryType: string;
  columns: ReportColumn[];

  join?: {
    entryType: string;
    type: "inner" | "left" | "right";
    columns: ReportColumn[];
  };
  filter?: Record<string, string | number | AdvancedFilter>;
}

export interface ReportColumn {
  name: string;
  order?: number;
  aggregate?: boolean;
  alias?: string;
  operation?: "sum" | "avg" | "count" | "min" | "max";
}
