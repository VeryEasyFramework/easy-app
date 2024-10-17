import startProcess from "#/app/runner/startProcess.ts";
import { getCoreCount } from "#/utils.ts";
import type { EasyAppConfig } from "#/appConfig/appConfigTypes.ts";
import { easyLog } from "#/log/logging.ts";

interface BeginOptions {
  multiProcess: EasyAppConfig<"postgres">["multiProcessing"];
  args: string[];
  flags?: string[];
  signal?: AbortSignal;
}

/**
 * Begin the app by starting the broker and app processes.
 */
export default function begin(
  options: BeginOptions,
): void {
  startProcess({
    args: ["broker", ...options.args],
    flags: options.flags,
    signal: options.signal,
  });
  startApp(options);
  startWorkers(options);
}

function startWorkers(options: BeginOptions) {
  const workers = ["short", "medium", "long"];
  for (const worker of workers) {
    startProcess({
      args: ["--worker", worker, ...options.args],
      flags: options.flags,
      signal: options.signal,
    });
  }
}

async function startApp(options: BeginOptions) {
  let cores = 1;
  const { enable, processCount, max } = options.multiProcess;
  if (enable && Deno.build.os === "linux") {
    cores = processCount === "auto" ? await getCoreCount() : processCount;
    if (max && cores > max) {
      cores = max;
    }
  }

  const pids: number[] = [];
  for (let i = 0; i < cores; i++) {
    pids.push(
      startProcess({
        args: ["app", "-n", i.toString(), ...options.args],
        flags: options.flags,
        signal: options.signal,
      }),
    );
  }
  easyLog.warning(`Starting ${cores} app processes`, "MultiProcess", {
    hideTrace: true,
  });
}
