import { MemcacheParser } from "#orm/database/adapter/adapters/memcached/mcParser.ts";
import type {
  ClientConfig,
  GetFlagMap,
  GetOptions,
} from "#orm/database/adapter/adapters/memcached/mcTypes.ts";

const getFlagMap: GetFlagMap = {
  base64: "b", // interpret key as base64 encoded binary value
  cas: "c", // return item cas token
  flags: "f", // return client flags token
  hit: "h", // return whether item has been hit before as a 0 or 1
  key: "k", // return key as a token
  lastAccess: "l", // return time since item was last accessed in seconds
  opaque: "O", // opaque value, consumes a token and copies back with response
  noreply: "q", // use noreply semantics for return codes.
  size: "s", // return item size token
  ttl: "t", // return item TTL remaining in seconds (-1 for unlimited)
  noLru: "u", // don't bump the item in the LRU
  value: "v", // return item value in <data block>
};

export class MemcacheClient {
  connection!: Deno.Conn;
  buffSize: number = 1024;
  buffer: Uint8Array;
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();
  parser = new MemcacheParser();

  constructor() {
    console.log("MemcacheClient");
    this.buffer = new Uint8Array(this.buffSize);
  }

  decode(buf: Uint8Array) {
    return this.decoder.decode(buf);
  }

  encode(str: string) {
    return this.encoder.encode(str);
  }

  async connect(options?: ClientConfig) {
    if (options?.unixPath) {
      if (options.host || options.port) {
        throw new Error("Cannot use both unixPath and host/port");
      }
      this.connection = await Deno.connect({
        transport: "unix",
        path: options.unixPath,
      });
    }
    if (options?.port || options?.host || !options) {
      if (options?.unixPath) {
        throw new Error("Cannot use both unixPath and host/port");
      }

      this.connection = await Deno.connect({
        port: options?.port || 11211,
        hostname: options?.host || "localhost",
      });
    }
  }

  async readAll() {
    let data: Uint8Array = new Uint8Array();
    let readCount = 0;
    while (readCount !== -1) {
      readCount = await this.connection.read(this.buffer) || -1;
      data = new Uint8Array([
        ...data,
        ...this.buffer.slice(0, readCount),
      ]);
      if (readCount < this.buffSize) break;
    }
    // console.log(data)
    return data;
  }

  async response() {
    const data = await this.readAll();

    return this.parser.parse(data);
  }

  async set(table: string, id: string, value: string) {
    const key = `${table}${id}`;
    const data = this.encode(`ms ${key} ${value.length}\r\n${value}\r\n`);
    const writeCount = await this.connection.write(data);
    console.log({ writeCount });
    return await this.response();
  }

  async get(table: string, id: string, options?: GetOptions) {
    let flags: string[] = [];
    if (!options) options = { value: true };
    if (options) {
      for (const key in options) {
        if (options[key as keyof GetFlagMap]) {
          flags.push(getFlagMap[key as keyof GetFlagMap]);
        }
      }
      if ("value" in options && !options.value) {
        flags = flags.filter((flag) => flag !== "v");
      }
    }

    const key = `${table}${id}`;
    const data = this.encode(`mg ${key} ${flags.join(" ").trim()}\r\n`);
    await this.connection.write(data);
    return await this.response();
  }

  async setJson(table: string, id: string, value: Record<string, any>) {
    const json = JSON.stringify(value);
    return await this.set(table, id, json);
  }

  async getJson(table: string, id: string) {
    const response = await this.get(table, id);
    if (!response) return null;
    return JSON.parse(response);
  }

  async setList(listId: string, value: any[]) {
    const json = JSON.stringify(value);
    return await this.set("list", listId, json);
  }

  async getList(listId: string) {
    const response = await this.get("list", listId);
    if (!response) return null;
    return JSON.parse(response);
  }
}
