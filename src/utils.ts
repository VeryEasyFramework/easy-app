export function joinPath(...paths: string[]) {
  const path = paths.join("/");
  if (Deno.build.os === "windows") {
    return path.replace(/\\/g, "/");
  }
  return path;
}
