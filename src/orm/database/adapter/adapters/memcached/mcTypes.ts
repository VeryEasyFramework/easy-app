export interface GetFlagMap {
  base64: string;
  cas: string;
  flags: string;
  hit: string;
  key: string;
  lastAccess: string;
  opaque: string;
  noreply: string;
  size: string;
  ttl: string;
  noLru: string;
  value: string;
}

export type GetReturnCode = "HD" | "VA" | "EN";
export type SetReturnCode = "HD" | "NS" | "EX" | "NF";
// - "HD" (STORED), to indicate success.

// - "NS" (NOT_STORED), to indicate the data was not stored, but not
// because of an error.
//
// - "EX" (EXISTS), to indicate that the item you are trying to store with
// CAS semantics has been modified since you last fetched it.

// - "NF" (NOT_FOUND), to indicate that the item you are trying to store
// with CAS semantics did not exist.
export type GetOptions = Partial<Record<keyof GetFlagMap, boolean>>;

export interface ClientConfig {
  host?: string;
  port?: number;
  unixPath?: string;
}

export interface PoolConfig extends ClientConfig {
  poolSize?: number;
  lazyConnect?: boolean;
}
