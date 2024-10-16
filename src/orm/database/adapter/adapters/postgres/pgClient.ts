//https://www.postgresql.org/docs/16/protocol-flow.html
//https://www.postgresql.org/docs/16/protocol-message-formats.html

import { errorCodeMap, pgErrorMap } from "./maps/errorMap.ts";
import { PgError } from "#orm/database/adapter/adapters/postgres/pgError.ts";
import { toCamelCase } from "@vef/string-utils";
import {
  type ColumnDescription,
  type PgClientConfig,
  QR_TYPE,
  type QueryResponse,
  type ServerStatus,
  type SimpleQueryResponse,
} from "#orm/database/adapter/adapters/postgres/pgTypes.ts";
import { MessageWriter } from "#orm/database/adapter/adapters/postgres/messageWriter.ts";
import { MessageReader } from "#orm/database/adapter/adapters/postgres/messageReader.ts";
import {
  convertToDataType,
  getDataType,
  statusMap,
} from "#orm/database/adapter/adapters/postgres/maps/maps.ts";
import { AUTH } from "#orm/database/adapter/adapters/postgres/pgAuth.ts";
import { ScramClient } from "#orm/database/adapter/adapters/postgres/scram.ts";

export class PostgresClient {
  private conn!: Deno.Conn;
  private readonly connectionParams: PgClientConfig;
  private camelCase: boolean;
  cancelInfo: {
    pid: number;
    secret: number;
  };
  private readonly serverParams: Record<string, string>;

  private readonly writer: MessageWriter;
  private reader!: MessageReader;
  private decoder: TextDecoder = new TextDecoder();
  serverStatus: ServerStatus;
  private status: "connected" | "notConnected" = "notConnected";

  get connected() {
    return this.status === "connected";
  }

  constructor(options: PgClientConfig) {
    if (!options.options) {
      options.options = {};
    }
    if (!options.options.client_encoding) {
      options.options.client_encoding = "UTF8";
    }
    this.connectionParams = options;

    this.camelCase = options.camelCase || false;
    this.writer = new MessageWriter();
    this.serverParams = {};
    this.serverStatus = "notConnected";
    this.cancelInfo = {
      pid: 0,
      secret: 0,
    };
  }
  private decode(data: Uint8Array): string {
    const chunkSize = 512;
    let offset = 0;
    let message = "";
    while (offset < data.length) {
      const chunk = data.subarray(offset, offset + chunkSize);
      message += this.decoder.decode(chunk);
      offset += chunkSize;
    }
    return message;
  }
  private async readResponseHeader() {
    const buffer = new Uint8Array(5);
    await this.conn.read(buffer);
  }

  async connect() {
    if (this.connected) {
      return;
    }
    let connectionType: "tcp" | "unix" = "tcp";
    const { host, port, unixPath } = this.connectionParams;
    if (unixPath) {
      if (host || port) {
        throw new PgError({
          message: "Cannot use both unixPath and host/port",
        });
      }
      connectionType = "unix";
    }

    switch (connectionType) {
      case "tcp": {
        this.conn = await Deno.connect({
          port: port || 5432,
          hostname: host || "localhost",
        });
        break;
      }
      case "unix": {
        this.conn = await Deno.connect({
          transport: "unix",
          path: unixPath as string,
        });
        break;
      }
    }

    this.reader = new MessageReader(this.conn);
    const writer = this.writer;
    writer.addInt32(196608);
    writer.addCString("user");
    writer.addCString(this.connectionParams.user);
    writer.addCString("database");
    writer.addCString(this.connectionParams.database);
    if (this.connectionParams.options) {
      for (
        const [key, value] of Object.entries(
          this.connectionParams.options,
        )
      ) {
        writer.addCString(key);
        writer.addCString(value);
      }
    }
    writer.addCString("");
    await this.conn.write(writer.message);
    // const data = await reader(this.conn)
    // messageParser(data)
    // return
    const client = new ScramClient(
      this.connectionParams.user,
      this.connectionParams.password as string,
    );
    while (this.status !== "connected") {
      await this.reader.nextMessage();
      switch (this.reader.messageType) {
        case "R": {
          const authType = this.reader.readInt32();

          switch (authType) {
            case AUTH.NO_AUTHENTICATION: {
              break;
            }
            case AUTH.CLEAR_TEXT: {
              const password = this.connectionParams.password;
              this.writer.setMessageType("p");
              this.writer.addCString(password);
              await this.conn.write(this.writer.message);
              break;
            }
            case AUTH.MD5: {
              throw new PgError({
                message: "MD5 authentication not implemented",
              });

              //  md5 authentication
              break;
            }
            case AUTH.SASL_STARTUP: {
              const clientFirstMessage = client.composeChallenge();
              this.writer.reset();
              this.writer.setMessageType("p");
              this.writer.addCString("SCRAM-SHA-256");
              this.writer.addInt32(clientFirstMessage.length);
              this.writer.addString(clientFirstMessage);

              await this.conn.write(this.writer.message);

              break;
            }
            case AUTH.SASL_CONTINUE: {
              const utf8Decoder = new TextDecoder("utf-8");
              const message = this.reader.readAllBytes();

              await client.receiveChallenge(utf8Decoder.decode(message));
              const clientFinalMessage = await client.composeResponse();
              this.writer.reset();
              this.writer.setMessageType("p");
              this.writer.addString(clientFinalMessage);
              await this.conn.write(this.writer.message);

              break;
            }
            case AUTH.SASL_FINAL: {
              const message = this.reader.readAllBytes();

              await client.receiveResponse(this.decode(message));
              break;
            }
            default: {
              throw new PgError({
                message: "Unknown authentication type",
              });
            }
          }

          break;
        }
        case "S": {
          const param = this.reader.readCString();
          this.serverParams[param] = this.reader.readCString();

          break;
        }
        case "Z": {
          this.status = "connected";
          const status = this.reader.readString(1) as "I" | "T" | "E";

          this.serverStatus = statusMap[status];

          break;
        }
        case "E": {
          await this.readError();
          throw new PgError({
            massage: "Error connecting to Postgres",
          });
        }
        case "K": {
          // const keyData = new DataView(this.reader.readAllBytes().buffer);
          const pid = this.reader.readInt32();
          const key = this.reader.readInt32();
          this.cancelInfo = { pid, secret: key };
          break;
        }
        default: {
          throw new PgError({ message: "Unknown message type" });
        }
      }
    }
  }

  private readError() {
    const errorFields: Record<string, any> = {};
    let offset = 0;
    while (this.reader.offset < this.reader.messageLength) {
      const field = this.reader.readChar() as
        | keyof typeof errorCodeMap
        | null;
      if (!field) {
        break;
      }
      const value = this.reader.readCString();

      errorFields[errorCodeMap[field]] = value;
      offset++;
      if (offset > this.reader.messageLength) {
        break;
      }
    }
    errorFields["name"] = pgErrorMap[
      errorFields["code"] as keyof typeof pgErrorMap
    ];
    return errorFields;
  }
  private parseRowDescription(): ColumnDescription[] {
    const columnCount = this.reader.readInt16();

    const columns: ColumnDescription[] = [];
    for (let i = 0; i < columnCount; i++) {
      const name = this.reader.readCString();
      const tableID = this.reader.readInt32();
      const columnID = this.reader.readInt16();
      const dataTypeID = this.reader.readInt32();
      const dataTypeSize = this.reader.readInt16();
      const dataTypeModifier = this.reader.readInt32();
      const format = this.reader.readInt16();
      const column: ColumnDescription = {
        name,
        camelName: toCamelCase(name),
        tableID,
        columnID,
        dataTypeID,
        dataType: getDataType(dataTypeID),
        dataTypeSize,
        dataTypeModifier,
        format,
      };
      columns.push(column);
    }

    return columns;
  }
  async query<T>(
    query: string,
  ): Promise<QueryResponse<T>> {
    const writer = this.writer;
    writer.setMessageType("Q");
    writer.addCString(query);
    await this.conn.write(writer.message);
    let status;
    const fields: ColumnDescription[] = [];
    const data: T[] = [];
    const errors: any[] = [];
    let gotDescription = false;
    let rowCount = 0;
    while (!status) {
      await this.reader.nextMessage();
      const messageType = this.reader
        .messageType as keyof SimpleQueryResponse;
      switch (messageType) {
        case QR_TYPE.ROW_DESCRIPTION: {
          if (gotDescription) {
            throw new PgError({ message: "Got row description twice" });
            break;
          }
          gotDescription = true;
          const columns = this.parseRowDescription();

          fields.push(...columns);
          break;
        }
        case QR_TYPE.DATA_ROW: {
          rowCount++;
          const columnCount = this.reader.readInt16();
          const row = {} as Record<string, any>;
          for (let i = 0; i < columnCount; i++) {
            const field = fields[i];

            const length = this.reader.readInt32(); //

            if (length === -1) {
              row[field.camelName] = null;
              continue;
            }
            const column = this.reader.readBytes(length);

            row[field.camelName] = convertToDataType(
              column,
              field.dataTypeID,
              field.dataType,
            );
          }
          data.push(row as T);
          break;
        }
        case QR_TYPE.READY_FOR_QUERY: {
          const serverStatus = this.reader.readString(1) as
            | "I"
            | "T"
            | "E";
          this.serverStatus = statusMap[serverStatus];
          status = "done";
          break;
        }
        case QR_TYPE.ERROR_RESPONSE: {
          const error = this.readError();
          errors.push(error);
          break;
        }
        case QR_TYPE.EMPTY_QUERY_RESPONSE: {
          break;
        }
        case QR_TYPE.COMMAND_COMPLETE: {
          const message = this.reader.readAllBytes();
          break;
        }
        default: {
          const message = this.reader.readAllBytes();
          const messageType = this.reader.messageType;
          const messageString = this.decode(message);
          throw new PgError({
            message: `Unknown message type ${messageType}${messageString}`,
          });
        }
      }
    }
    if (errors.length) {
      throw new PgError(errors[0]);
    }
    const result: QueryResponse<T> = {
      rowCount: data.length,
      rows: data,
      columns: fields,
    };
    return result;
  }
}
