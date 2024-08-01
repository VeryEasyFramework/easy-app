import type { EasyRequest } from "../easyRequest.ts";
import { FileCache } from "./fileCache.ts";
import { inferMimeType } from "#/staticFiles/mimeTypes.ts";

export class StaticFileHandler {
  cache: FileCache;
  staticFilesRoot: string;
  notFoundPage?: string;
  constructor(staticFilesRoot: string) {
    this.cache = new FileCache();
    this.staticFilesRoot = staticFilesRoot;
  }

  async serveFile(path: string): Promise<Response> {
    const isFile = inferMimeType(path);
    const endsWithSlash = path.endsWith("/");
    if (!isFile && endsWithSlash) {
      path += "index.html";
    } else if (!isFile && !endsWithSlash) {
      path += "/index.html";
    }
    console.log(`Serving file: ${path}`);
    try {
      const fileContent = await this.cache.loadFile(
        this.staticFilesRoot,
        path,
      );
      return new Response(fileContent.content, {
        status: 200,
        headers: {
          "Content-Type": fileContent.mimeType,
        },
      });
    } catch (_e) {
      console.error(_e);
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
