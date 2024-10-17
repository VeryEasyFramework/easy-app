import { MemcacheClient } from "#orm/database/adapter/adapters/memcached/mcClient.ts";
import type {
  ClientConfig,
  GetOptions,
  PoolConfig,
} from "#orm/database/adapter/adapters/memcached/mcTypes.ts";

class PoolClient {
  locked: boolean = false;
  connection: MemcacheClient;

  constructor() {
    this.connection = new MemcacheClient();
  }

  get connected() {
    return this.connection.connection !== undefined;
  }
}

export class MemcachePool {
  private clients: PoolClient[] = [];

  private clientConfig: ClientConfig;

  constructor(options: PoolConfig) {
    const size = options.poolSize || 5;
    for (let i = 0; i < size; i++) {
      this.clients.push(new PoolClient());
    }

    if (options?.unixPath && (options?.host || options?.port)) {
      throw new Error("Cannot use both unixPath and host/port");
    }

    this.clientConfig = {
      host: options.host,
      port: options.port,
      unixPath: options.unixPath,
    };
    if (!options.lazyConnect) {
      this.connectAll();
    }
  }
  private connectAll() {
    this.clients.forEach((client) => {
      if (!client.connected) {
        client.connection.connect(this.clientConfig);
      }
    });
  }
  private async getClient() {
    let client = this.clients.find((client) => !client.locked);
    if (!client) {
      client = new PoolClient();
      this.clients.push(client);
      client = await this.getClient() as PoolClient;
    }

    client.locked = true;
    if (!client.connected) {
      await client.connection.connect(this.clientConfig);
    }

    return client;
  }

  async set(table: string, id: string, value: string) {
    const client = await this.getClient();
    const res = await client.connection.set(table, id, value);
    client.locked = false;
    return res;
  }

  async get(table: string, id: string, options?: GetOptions) {
    const client = await this.getClient();
    const res = await client.connection.get(table, id, options);
    client.locked = false;
    return res;
  }

  async setJson(table: string, id: string, value: Record<string, any>) {
    const client = await this.getClient();
    const res = await client.connection.setJson(table, id, value);
    client.locked = false;
    return res;
  }

  async getJson<T>(table: string, id: string) {
    const client = await this.getClient();
    const res = await client.connection.getJson(table, id);
    client.locked = false;
    return res as T | null;
  }

  async setList(listId: string, value: any[]) {
    const client = await this.getClient();
    const res = await client.connection.setList(listId, value);
    client.locked = false;
    return res;
  }

  async getList(listId: string) {
    const client = await this.getClient();
    const res = await client.connection.getList(listId);
    client.locked = false;
    return res;
  }
}
