/**
 * Joins multiple path segments into a single path.
 * The path segments are joined with a forward slash (/) regardless of the OS.
 */
export function joinPath(...paths: string[]) {
  const path = paths.join("/");
  if (Deno.build.os === "windows") {
    return path.replace(/\\/g, "/");
  }
  return path;
}

/**
 * Takes a path and returns it with the correct path separator for the current OS.
 * The helps with normalizing the path references in the code for cross-platform compatibility.
 * (e.g. Windows uses backslashes, while Unix-based systems use forward slashes)
 */
export function setPathForOS(path: string) {
  if (Deno.build.os === "windows") {
    return path.replace(/\\/g, "/");
  }
  return path;
}

export function asyncPause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
