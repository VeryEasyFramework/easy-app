import {
  PostgresClient,
} from "#orm/database/adapter/adapters/postgres/pgClient.ts";

import type { PostgresConfig } from "#orm/database/adapter/adapters/pgAdapter.ts";
import type {
  PgClientConfig,
  QueryResponse,
} from "#orm/database/adapter/adapters/postgres/pgTypes.ts";
import { raiseOrmException } from "#orm/ormException.ts";

class PostgresPoolClient {
  locked: boolean;
  client: PostgresClient;
  close: boolean;
  constructor(config: PgClientConfig) {
    this.close = false;
    this.locked = false;
    this.client = new PostgresClient(config);
  }
  async connect() {
    await this.client.connect();
  }

  async query<T>(query: string): Promise<QueryResponse<T>> {
    return await this.client.query<T>(query).catch((e) => {
      this.locked = false;

      throw e;
    });
  }
  get connected() {
    return this.client.connected;
  }
}

export class PostgresPool {
  private readonly clients: PostgresPoolClient[];
  private readonly size: number;
  private readonly lazy: boolean;
  private readonly clientConfig: PgClientConfig;
  private readonly maxWait: number;
  private readonly maxClients: number;
  constructor(config: PostgresConfig) {
    this.clients = [];
    this.maxClients = 10;
    const options = config.clientOptions;
    if (options?.unixPath && (options?.host || options?.port)) {
      throw new Error("Cannot use both unixPath and host/port");
    }
    this.clientConfig = options;
    this.size = config.size || 1;

    if (this.size > this.maxClients) {
      this.maxClients = this.size;
    }
    this.lazy = config.lazy || false;
    this.maxWait = 5000;
    for (let i = 0; i < this.size; i++) {
      this.clients.push(new PostgresPoolClient(this.clientConfig));
    }
  }

  async initialized() {
    if (this.lazy) {
      return;
    }
    for (const client of this.clients) {
      await client.connect();
    }
  }
  private async getClient() {
    let client: PostgresPoolClient | undefined;
    const start = Date.now();
    while (!client) {
      if (Date.now() - start > this.maxWait) {
        raiseOrmException(
          "DatabaseError",
          "Timeout waiting for connection pool client",
        );
      }
      client = this.clients.find((c) => !c.locked);
      if (!client) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    client.locked = true;
    await client.connect();
    return client;
  }

  private returnClient(client: PostgresPoolClient) {
    client.locked = false;
  }
  private replaceClient(client: PostgresPoolClient) {
    client.client = new PostgresClient(this.clientConfig);
  }
  async query<T>(query: string): Promise<QueryResponse<T>> {
    const client = await this.getClient();
    const result = await client.query<T>(query);

    this.returnClient(client);
    return result;
  }
}