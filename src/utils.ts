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

/**
 * Get the number of CPU cores available on the system.
 */
export async function getCoreCount(): Promise<number> {
  if (Deno.build.os !== "linux") {
    return 1;
  }

  const cmd = new Deno.Command("nproc", {
    stdout: "piped",
  });

  const proc = cmd.spawn();

  const output = await proc.output();
  const cors = new TextDecoder().decode(output.stdout).trim();
  const coreCount = parseInt(cors);
  return isNaN(coreCount) ? 1 : coreCount;
}

export function checkForFile(path: string): boolean {
  try {
    Deno.statSync(joinPath(Deno.cwd(), path));
    return true;
  } catch (_e) {
    return false;
  }
}

export function savePID(pid: number, path: string) {
  const pidString = `${pid.toString()}\n`;
  Deno.writeTextFileSync(path, pidString, {
    append: true,
  });
}

export function base64Encode(input: string): string {
  return btoa(input);
}
