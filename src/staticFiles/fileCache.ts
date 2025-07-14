import { EasyException } from "#/easyException.ts";
import { joinPath } from "#/utils.ts";
import { inferMimeType, type MimeValue } from "#/staticFiles/mimeTypes.ts";

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

  clearCache() {
    this.cache.clear();
  }
  private async getFile(
    root: string,
    path: string,
  ): Promise<CachedFile> {
    const mimeType = inferMimeType(path) || "text/plain";
    try {
      return {
        content: await Deno.readFile(joinPath(root, path)),
        mimeType: mimeType,
      };
    } catch (_e) {
      if (_e instanceof Deno.errors.NotFound) {
        throw new EasyException(`File not found: ${path}`, 404, "FileNotFound");
      }
      throw _e;
    }
  }
  async loadFile(root: string, path: string): Promise<CachedFile> {
    if (this.skipCache) {
      return await this.getFile(root, path);
    }
    let file: CachedFile | undefined = this.cache.get(path);
    if (!file) {
      file = await this.getFile(root, path);
      if (file) {
        this.cache.set(path, file);
      }
    }

    return file;
  }
}
