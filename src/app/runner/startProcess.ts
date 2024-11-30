import { raiseEasyException } from "#/easyException.ts";
import type { AppProcess } from "#/app/runner/begin.ts";
import { checkForFile } from "#/utils.ts";

/**
 * Start a new process with the given options.
 */
export default function startProcess(name: string, options?: {
  args?: string[];
  flags?: string[];
  signal?: AbortSignal;
}): AppProcess {
  const cwd = Deno.cwd();

  const args = options?.args || [];
  const flags = options?.flags || [];

  if (
    !flags.includes("--unstable-kv")
  ) {
    flags.push("--unstable-kv");
  }
  let prodBinary = "app";
  const platform = Deno.build.os;
  switch (platform) {
    case "windows":
      prodBinary = "app.exe";
      break;
    case "darwin":
      prodBinary = "appOsx";

      break;
    default:
      prodBinary = "app";
      break;
  }
  if (checkForFile(prodBinary)) {
    let bin = "./app";
    switch (platform) {
      case "windows":
        bin = "./app.exe";
        break;
      case "darwin":
        bin = "./appOsx";
        break;
      case "linux":
        bin = "./app";
        break;
      default:
        raiseEasyException(`Platform ${platform} not supported`, 500);
    }
    const cmd = new Deno.Command(bin, {
      args,
      cwd,

      signal: options?.signal,
      // stdout: "piped",
    });
    const process = cmd.spawn();

    return {
      name,
      process,
    };
  }
  const denoBin = Deno.execPath();
  const mainModule = "main.ts";
  const cmdArgs = [
    "run",
    "-A",
    "--unstable-net",
    ...flags,
    `${mainModule}`,
    ...args,
  ];

  const cmd = new Deno.Command(denoBin, {
    args: cmdArgs,
    cwd,
    signal: options?.signal,
  });

  const process = cmd.spawn();

  return {
    name,
    process,
  };
}
