import type { EasyApp } from "#/app/easyApp.ts";
import { easyLog } from "#/log/logging.ts";
import type { EntryClass } from "#orm/entry/entry/entryClass/entryClass.ts";

export default async function runWorker(
  app: EasyApp,
  mode: "short" | "medium" | "long",
) {
  app.workerMode = mode;
  app.processNumber = `${mode} worker`;
  await app.init();
  await app.boot();
  easyLog.info(`Starting ${mode} worker`, "~~~~~");

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
  await checkForTasks(app);
}
export async function checkForTasks(app: EasyApp) {
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
  const workerTimeout = (workerSettings[`${worker}Timeout`] as number || 90) *
    1000;
  const tasks = await app.orm.getEntryList("taskQueue", {
    filter: {
      status: "queued",
      worker,
    },
    orderBy: "queuedAt",
    order: "asc",
    columns: ["id"],
  });
  if (tasks.rowCount > 0) {
    for (const item of tasks.data) {
      workerSettings[`${worker}WorkerStatus`] = "running";
      await workerSettings.save();
      const task = await app.orm.getEntry<Task>("taskQueue", item.id);

      const result = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Task timed out"));
        }, workerTimeout);
        task.runAction("runTask").then((result) => {
          clearTimeout(timeout);
          resolve(result);
        }).catch((e) => {
          clearTimeout(timeout);
          reject(e);
        });
      });
      await result.catch(async (e) => {
        let message = `Error running task ${task.id}`;
        if (e instanceof Error) {
          message += `: ${e.message}`;
        }
        easyLog.error(message);
        task.status = "failed";
        task.taskData = {
          ...task.taskData,
          error: e.message,
        };
        await task.save();
      });
      workerSettings[`${worker}WorkerStatus`] = "ready";
      await workerSettings.save();
    }
  }
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
