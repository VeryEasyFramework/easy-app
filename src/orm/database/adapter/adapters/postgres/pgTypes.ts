interface ConnectionOptions {
  application_name?: string;
  client_encoding?: string;
  idle_session_timeout?: number;
  dateStyle?: string;
  TimeZone?: string;
}

export interface PgClientConfig {
  database: string;
  user: string;
  connectionType?: "unix" | "tcp";
  host?: string;
  port?: number;
  camelCase?: boolean;
  unixPath?: string;
  password?: string;
  options?: ConnectionOptions;
}
export interface DataTypeMap {
  16: "bool";
  17: "bytea";
  18: "char";
  19: "name";
  20: "int8";
  21: "int2";
  22: "int2vector";
  23: "int4";
  24: "regproc";
  25: "text";
  26: "oid";
  27: "tid";
  28: "xid";
  29: "cid";
  30: "oidvector";
  114: "json";
  142: "xml";
  1043: "varchar";
  1114: "timestamp";
  1184: "timestamptz";
  1082: "date";
  1700: "numeric";
  3802: "jsonb";
}
export interface ColumnDescription {
  name: string;
  camelName: string;
  tableID: number;
  columnID: number;

  dataTypeID: number;
  dataType: DataTypeMap[keyof DataTypeMap] | "unknown";
  dataTypeSize: number;
  dataTypeModifier: number;
  format: number;
}
export type QueryResponse<T> = {
  rows: T[];
  rowCount: number;
  columns: ColumnDescription[];
};
export type ClientMessageType =
  | "Q"
  | "X"
  | "B"
  | "C"
  | "f"
  | "D"
  | "E"
  | "H"
  | "F"
  | "p"
  | "P";
export type ServerMessageType = "S" | "R" | "Z" | "E" | "K";

export type ServerStatus =
  | "idle"
  | "transaction"
  | "error"
  | "notConnected"
  | "keyData"
  | "unknown";
export type SimpleQueryResponseType =
  | "CommandComplete"
  | "CopyInResponse"
  | "CopyOutResponse"
  | "RowDescription"
  | "DataRow"
  | "EmptyQueryResponse"
  | "ErrorResponse"
  | "ReadyForQuery"
  | "NoticeResponse";

export type SimpleQueryResponse = {
  "C": "CommandComplete";
  "G": "CopyInResponse";
  "H": "CopyOutResponse";
  "T": "RowDescription";
  "D": "DataRow";
  "I": "EmptyQueryResponse";
  "E": "ErrorResponse";
  "Z": "ReadyForQuery";
  "N": "NoticeResponse";
};

export const QR_TYPE = {
  COMMAND_COMPLETE: "C",
  COPY_IN_RESPONSE: "G",
  COPY_OUT_RESPONSE: "H",
  ROW_DESCRIPTION: "T",
  DATA_ROW: "D",
  EMPTY_QUERY_RESPONSE: "I",
  ERROR_RESPONSE: "E",
  READY_FOR_QUERY: "Z",
  NOTICE_RESPONSE: "N",
} as const;

export const STATUS_MAP = {
  IDLE: "I",
  TRANSACTION: "T",
  ERROR: "E",
  KEY_DATA: "K",
} as const;
