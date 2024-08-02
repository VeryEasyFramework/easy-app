import { joinPath } from "../utils.ts";
import { inferMimeType, type MimeValue } from "./mimeTypes.ts";

export interface CachedFile {
  content: Uint8Array;
  mimeType: MimeValue;
}

export class FileCache {
  private cache = new Map<string, CachedFile>();
  skipCache: boolean;
  constructor(skipCache?: boolean) {
    this.skipCache = skipCache || false;
  }
  private async getFile(root: string, path: string): Promise<CachedFile> {
    const mimeType = inferMimeType(path) || "text/plain";
    return {
      content: await Deno.readFile(joinPath(root, path)),
      mimeType: mimeType,
    };
  }
  async loadFile(root: string, path: string): Promise<CachedFile | never> {
    if (this.skipCache) {
      return await this.getFile(root, path);
    }
    let file = this.cache.get(path);
    if (!file) {
      file = await this.getFile(root, path);
      this.cache.set(path, file);
    }
    return file;
  }
}
