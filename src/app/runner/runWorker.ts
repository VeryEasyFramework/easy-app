import type { EasyApp } from "#/app/easyApp.ts";
import { easyLog } from "#/log/logging.ts";
import { PgError } from "#orm/database/adapter/adapters/postgres/pgError.ts";
import type { EntityRecordClass } from "#orm/entity/entity/entityRecord/entityRecord.ts";
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
  const workerSettings = await app.orm.getSettings("workerSettings");
  const maxTasks = workerSettings.maxTaskCount as number;
  const tasks = await app.orm.getEntityList("taskQueue", {
    filter: {
      status: "queued",
      worker,
    },
    columns: ["id"],
    limit: maxTasks < 1 ? 1 : maxTasks,
  });
  let count = tasks.data.length;
  const currentCount = count;
  const totalCount = tasks.totalCount;
  const done = new Promise<void>((resolve) => {
    if (count === 0) {
      resolve();
    }
    workerSettings[`${worker}WorkerStatus`] = "running";
    workerSettings.save().then(() => {
      for (const item of tasks.data) {
        app.orm.getEntity<Task>("taskQueue", item.id).then(async (task) => {
          await task.runAction("runTask");
          count--;
          if (count === 0) {
            resolve();
          }
        });
      }
    });
  });
  await done;
  await workerSettings.load();

  workerSettings[`${worker}WorkerStatus`] = "ready";
  await workerSettings.save();
  let seconds = workerSettings.waitInterval as number || 10;

  if (seconds < 5) {
    seconds = 5;
  }

  if (totalCount === currentCount) {
    await asyncPause(seconds * 1000);
  }
  checkForTasks(app);
}

interface Task extends EntityRecordClass {
  taskType: "entity" | "app";
  recordType: string;
  recordId: string;
  action: string;
  taskData: Record<string, any>;
  worker: "short" | "medium" | "long";
  status: "queued" | "running" | "completed" | "failed";
}
