import { joinPath } from "../utils.ts";
import { inferMimeType, type MimeValue } from "./mimeTypes.ts";

export interface CachedFile {
  content: Uint8Array;
  mimeType: MimeValue;
}

export class FileCache {
  private cache = new Map<string, CachedFile>();

  async loadFile(root: string, path: string): Promise<CachedFile | never> {
    const mimeType = inferMimeType(path) || "text/plain";

    let file = this.cache.get(path);
    if (!file) {
      file = {
        content: await Deno.readFile(joinPath(root, path)),
        mimeType: mimeType,
      };
      this.cache.set(path, file);
    }
    return file;
  }
}
