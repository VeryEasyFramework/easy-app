import type { EasyApp } from "#/app/easyApp.ts";
import { easyLog } from "#/log/logging.ts";
import type { EntryClass } from "#orm/entry/entry/entryClass/entryClass.ts";
import { asyncPause } from "#/utils.ts";

export default function runWorker(
  app: EasyApp,
  mode: "short" | "medium" | "long",
) {
  app.workerMode = mode;
  app.processNumber = `${mode} worker`;

  const { workers } = app.config;

  app.config.serverOptions.port = workers[mode].port;
  app.config.serverOptions.hostname = "127.0.0.1";

  app.serve({
    name: `${mode} worker`,
  });

  Deno.addSignalListener("SIGINT", async () => {
    await app.orm.updateSettings("workerSettings", {
      [`${mode}WorkerStatus`]: "stopped",
      [`${mode}WorkerPid`]: null,
    });
    easyLog.warning("Shutting down", `Worker - ${mode}`, {
      compact: true,
      hideTrace: true,
    });
    app.exit(0);
  });
  checkForTasks(app);
}
async function checkForTasks(app: EasyApp) {
  const worker = app.workerMode;
  if (!worker) {
    easyLog.warning("No worker mode set", app.fullAppName);
    return;
  }
  const hooks = app.workerHooks[worker];
  for (const hook of hooks) {
    await hook(app);
  }
  const workerSettings = await app.orm.getSettings("workerSettings");
  const tasks = await app.orm.getEntryList("taskQueue", {
    filter: {
      status: "queued",
      worker,
    },
    orderBy: "createdAt",
    order: "asc",
    columns: ["id"],
    limit: 1,
  });
  if (tasks.rowCount > 0) {
    workerSettings[`${worker}WorkerStatus`] = "running";
    await workerSettings.save();
    const task = await app.orm.getEntry<Task>("taskQueue", tasks.data[0].id);
    try {
      await task.runAction("runTask");
    } catch (e) {
      let message = `Error running task ${task.id}`;
      if (e instanceof Error) {
        message += `: ${e.message}`;
      }
      easyLog.error(message);
    }
    await workerSettings.load();
    workerSettings[`${worker}WorkerStatus`] = "ready";
    await workerSettings.save();
  }

  let seconds = workerSettings.waitInterval as number || 10;

  if (seconds < 5) {
    seconds = 5;
  }

  await asyncPause(seconds * 1000);
  checkForTasks(app);
}

interface Task extends EntryClass {
  taskType: "entry" | "app";
  recordType: string;
  recordId: string;
  action: string;
  taskData: Record<string, any>;
  worker: "short" | "medium" | "long";
  status: "queued" | "running" | "completed" | "failed";
}
