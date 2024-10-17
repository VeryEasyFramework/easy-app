import { raiseEasyException } from "#/easyException.ts";

/**
 * Start a new process with the given options.
 */
export default function startProcess(options?: {
  args?: string[];
  flags?: string[];
  signal?: AbortSignal;
}): number {
  const cwd = Deno.cwd();

  const args = options?.args || [];
  const flags = options?.flags || [];

  if (
    !flags.includes("--unstable-kv")
  ) {
    flags.push("--unstable-kv");
  }
  if (args.includes("--prod")) {
    const platform = Deno.build.os;
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
    // process.stdout.pipeTo(
    //   new WritableStream({
    //     write(chunk) {
    //       console.log(chunk);
    //     },
    //   }),
    // );
    return process.pid;
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

  return process.pid;
}
