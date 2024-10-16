import { MemcacheError } from "#orm/database/adapter/adapters/memcached/mcError.ts";

/**
 * Memcache protocol parser
 */
export class MemcacheParser {
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();
  data!: Uint8Array;
  position = 0;
  length = 0;

  parse(data: Uint8Array) {
    this.position = 0;
    this.length = data.byteLength;
    this.data = data;
    // console.log(this.data)
    const responseCode = this.readNext();
    // console.log({responseCode})
    switch (responseCode) {
      case "HD":
        // STORED
        break;
      case "VA":
        return this.readValue();
      case "EN":
        break;
      default:
        throw new MemcacheError(`Unknown response code: ${responseCode}`);
    }
  }

  readValue() {
    const valueLength = this.readNext();
    const flags: string[] = [];
    while (true) {
      const flag = this.readNext();
      if (!flag) break;
      flags.push(flag);
    }
    const value = this.read(Number(valueLength));

    return this.decode(value);
  }

  read(count: number) {
    if (this.position + count > this.length) {
      throw new MemcacheError("Out of bounds");
    }
    const result = this.data.slice(this.position, this.position + count);
    // console.log({result})
    this.position += count;
    return result;
  }

  readString(count: number) {
    return this.decode(this.read(count));
  }

  readNext() {
    const delimiters = [32, 13, 10];
    const start = this.position;
    const current = new Uint8Array(1);
    const next = new Uint8Array(1);
    while (true) {
      if (this.position >= this.length) {
        // throw new CacheError('Out of bounds')
        break;
      }
      current.set(this.data.slice(this.position, this.position + 1));
      if (this.position + 1 < this.length) {
        next.set(this.data.slice(this.position + 1, this.position + 2));
      }
      this.position++;

      if (delimiters.includes(next[0])) {
        this.position++;
        // console.log('next', next[0])
        return this.decode(this.data.slice(start, this.position - 1));
      }
      if (delimiters.includes(current[0])) {
        if (current[0] === 10) {
          return false;
        }
      }
    }
  }

  decode(buf: Uint8Array) {
    return this.decoder.decode(buf);
  }
}
