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
}

export type MimeTypes = keyof MimeTypesMap;

export type MimeValue = MimeTypesMap[MimeTypes];

export function inferMimeType(path: string): MimeValue {
  const ext = path.split(".").pop() as MimeTypes | undefined;
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
    default:
      return "text/plain";
  }
}
