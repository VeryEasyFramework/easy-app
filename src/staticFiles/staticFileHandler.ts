import type { EasyRequest } from "../easyRequest.ts";
import { FileCache } from "./fileCache.ts";

export class StaticFileHandler {
  cache: FileCache;
  staticFilesRoot: string;
  notFoundPage?: string;
  constructor(staticFilesRoot: string) {
    this.cache = new FileCache();
    this.staticFilesRoot = staticFilesRoot;
  }

  async serveFile(request: EasyRequest): Promise<Response> {
    try {
      const fileContent = await this.cache.loadFile(
        this.staticFilesRoot,
        request.path,
      );
      return new Response(fileContent.content, {
        status: 200,
        headers: {
          "Content-Type": fileContent.mimeType,
        },
      });
    } catch (_e) {
      const fileContent = await this.cache.loadFile(
        import.meta.dirname || ".",
        "404.html",
      );
      return new Response(fileContent.content, {
        status: 404,
        headers: {
          "Content-Type": fileContent.mimeType,
        },
      });
    }
  }
}
