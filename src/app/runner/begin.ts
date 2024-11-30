import startProcess from "#/app/runner/startProcess.ts";
import { getCoreCount } from "#/utils.ts";
import type { EasyAppConfig } from "#/appConfig/appConfigTypes.ts";
import { easyLog } from "#/log/logging.ts";
import { toTitleCase } from "@vef/string-utils";
import type { EasyApp } from "#/app/easyApp.ts";

interface BeginOptions {
  multiProcess: EasyAppConfig<"postgres">["multiProcessing"];
  flags?: string[];
  app: EasyApp;
}

export interface AppProcess {
  name: string;
  process: Deno.ChildProcess;
}
/**
 * Begin the app by starting the broker and app processes.
 */
export default async function begin(
  options: BeginOptions,
): Promise<AppProcess[]> {
  console.clear();
  const app = options.app;
  easyLog.info(`Starting ${app.config.appName || "Easy App"}`, "~~~~~");

  const processes: AppProcess[] = [];

  const apps = await startApp(options);
  processes.push(...apps);
  const broker = startProcess("Message Broker", {
    args: ["broker"],
    flags: options.flags,
  });
  processes.push(broker);

  const workers = await startWorkers(app, options.flags);
  processes.push(...workers);
  return processes;
}

async function startWorkers(app: EasyApp, flags?: string[]) {
  const procs: AppProcess[] = [];
  const workers: string[] = ["short", "medium", "long"];
  const workerSettings = await app.orm.getSettings("workerSettings");

  for (const worker of workers) {
    const enabled = workerSettings[`${worker}WorkerEnabled`];
    if (!enabled) {
      workerSettings[`${worker}WorkerStatus`] = "stopped";
      workerSettings[`${worker}WorkerPid`] = null;
    }
    const proc = startProcess(`Worker - ${toTitleCase(worker)}`, {
      args: ["--worker", worker],
      flags,
    });
    workerSettings[`${worker}WorkerStatus`] = "ready";
    workerSettings[`${worker}WorkerPid`] = proc.process.pid;
    procs.push(proc);
  }
  await workerSettings.save();
  return procs;
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

  easyLog.warning(`Starting ${cores} app processes`, "Lifecycle", {
    compact: true,
    hideTrace: true,
  });
  const procs: { name: string; process: Deno.ChildProcess }[] = [];
  for (let i = 0; i < cores; i++) {
    const proc = startProcess(`App ${i}`, {
      args: ["app", "-n", i.toString()],
      flags: options.flags,
    });
    procs.push(proc);
  }

  return procs;
}
