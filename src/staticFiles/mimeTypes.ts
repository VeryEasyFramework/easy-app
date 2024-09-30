import { raiseEasyException } from "#/easyException.ts";

export interface MimeTypesMap {
  html: "text/html";
  js: "text/javascript";
  css: "text/css";
  json: "application/json";
  png: "image/png";
  jpg: "image/jpeg";
  jpeg: "image/jpeg";
  svg: "image/svg+xml";
  ico: "image/x-icon";
  txt: "text/plain";
  woff2: "font/woff2";
  woff: "font/woff";
  ttf: "font/ttf";
  otf: "font/otf";
}

export type MimeTypes = keyof MimeTypesMap;

export type MimeValue = MimeTypesMap[MimeTypes];

export function inferMimeType(path: string): MimeValue | undefined {
  const parts = path.split("/");
  const fileName = parts[parts.length - 1];
  const extParts = fileName.split(".");
  if (extParts.length < 2) {
    return undefined;
  }
  const ext = extParts[extParts.length - 1];
  switch (ext) {
    case "html":
      return "text/html";
    case "js":
      return "text/javascript";
    case "css":
      return "text/css";
    case "json":
      return "application/json";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "jpeg":
      return "image/jpeg";
    case "svg":
      return "image/svg+xml";
    case "ico":
      return "image/x-icon";
    case "txt":
      return "text/plain";
    case "woff2":
      return "font/woff2";
    case "woff":
      return "font/woff";
    case "ttf":
      return "font/ttf";
    case "otf":
      return "font/otf";

    default:
      if (ext) {
        raiseEasyException(`Unsupported file type: ${ext}`, 415);
      }
      return undefined;
  }
}
