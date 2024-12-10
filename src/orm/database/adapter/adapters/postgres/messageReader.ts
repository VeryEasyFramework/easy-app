import type { ServerMessageType } from "#orm/database/adapter/adapters/postgres/pgTypes.ts";

export class MessageReader {
  offset: number;
  size: number;
  headerBuffer: Uint8Array;
  currentMessage!: Uint8Array;
  dataView!: DataView;
  messageType!: ServerMessageType;
  messageLength!: number;
  conn: Deno.Conn;

  decoder = new TextDecoder();

  constructor(conn: Deno.Conn) {
    this.offset = 0;
    this.size = 4098;

    this.conn = conn;
    this.headerBuffer = new Uint8Array(5);
  }

  async nextMessage() {
    this.headerBuffer = new Uint8Array(5);
    const res = await this.conn.read(this.headerBuffer);
    if (res === null) {
      return;
    }
    this.messageType = this.decode(
      this.headerBuffer.slice(0, 1),
    ) as ServerMessageType;
    this.messageLength = new DataView(this.headerBuffer.buffer).getUint32(
      1,
      false,
    );
    // read from the connection until we have the full message length
    this.currentMessage = new Uint8Array(this.messageLength);
    let bytesRead = 0;
    let data = new Uint8Array(0);
    const actualLength = this.messageLength - 4;

    while (bytesRead < actualLength) {
      const remaining = actualLength - bytesRead;
      const buf = new Uint8Array(remaining);
      const res = await this.conn.read(buf);
      if (res === null) {
        break;
      }
      data = new Uint8Array([...data, ...buf.slice(0, res)]);

      bytesRead += res;
    }
    this.currentMessage = new Uint8Array([
      ...data,
    ]);
    this.dataView = new DataView(this.currentMessage.buffer);
    this.offset = 0;
  }

  decode(data: Uint8Array) {
    return this.decoder.decode(data);
  }

  getType() {
  }

  readByte() {
    return this.currentMessage[this.offset++];
  }

  readInt32() {
    const num = this.dataView.getInt32(
      this.offset,
      false,
    );
    this.offset += 4;
    return num;
  }

  readInt16() {
    const num = this.dataView.getInt16(
      this.offset,
      false,
    );
    this.offset += 2;
    return num;
  }

  readCString() {
    const start = this.offset;
    const end = this.currentMessage.indexOf(0, start);
    const slice = this.currentMessage.slice(start, end);
    this.offset = end + 1;
    return this.decode(slice);
  }

  readBytes(length: number) {
    const slice = this.currentMessage.slice(
      this.offset,
      this.offset + length,
    );
    this.offset += length;
    return slice;
  }

  readChar() {
    const char = this.currentMessage[this.offset++];
    if (char === 0) {
      return null;
    }
    return String.fromCharCode(char);
  }

  readString(length: number) {
    const bytes = this.currentMessage.slice(
      this.offset,
      this.offset + length,
    );
    this.offset += length;
    return this.decode(bytes);
  }

  readAllBytes() {
    const slice = this.currentMessage.slice(this.offset);
    this.offset = this.currentMessage.length;
    return slice;
  }
  async clearBuffer() {
    this.currentMessage = new Uint8Array(this.size);
    this.offset = 0;
    const size = 1024;
    const buf = new Uint8Array(size);
    let res: number | null = 0;

    while (true) {
      res = await this.conn.read(buf);
      if (res === null) {
        break;
      }
      if (res < size) {
        break;
      }
    }
  }
}
