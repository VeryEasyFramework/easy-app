import { joinPath } from "../utils.ts";
import { inferMimeType, type MimeValue } from "./mimeTypes.ts";

export interface CachedFile {
  content: Uint8Array;
  mimeType: MimeValue;
}

export class FileCache {
  cache = new Map<string, CachedFile>();
  async loadFile(root: string, path: string) {
    let file = this.cache.get(path);
    if (!file) {
      file = {
        content: await Deno.readFile(joinPath(root, path)),
        mimeType: inferMimeType(path),
      };
      this.cache.set(path, file);
    }
    return file;
  }
}
