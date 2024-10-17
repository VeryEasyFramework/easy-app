import type { EasyApp } from "#/app/easyApp.ts";
import { easyLog } from "#/log/logging.ts";
import { PgError } from "#orm/database/adapter/adapters/postgres/pgError.ts";
import type { EntityRecord } from "#orm/entity/entity/entityRecord/entityRecord.ts";

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

  checkForTasks(app);
}
async function checkForTasks(app: EasyApp) {
  const worker = app.workerMode;
  if (!worker) {
    easyLog.warning("No worker mode set", app.fullAppName);
    return;
  }
  // easyLog.info("Checking for tasks", app.fullAppName);
  try {
    const tasks = await app.orm.getEntityList("taskQueue", {
      filter: {
        status: "queued",
        worker,
      },
    });
    // easyLog.info(`${tasks.rowCount} tasks`, app.fullAppName);
    for (const task of tasks.data) {
      await runTask(app, task.id);
    }
  } catch (e) {
    if (e instanceof PgError) {
      // const subject = toTitleCase(e.name);
      const subject = e.name;
      const message = `${subject}: ${e.message}`;
      easyLog.error(message, "Database Error (Postgres)", {
        hideTrace: true,
      });
    }
  }

  setTimeout(() => {
    checkForTasks(app);
  }, 10000);
}

interface Task extends EntityRecord {
  taskType: "entity" | "app";
  recordType: string;
  recordId: string;
  action: string;
  taskData: Record<string, any>;
  worker: "short" | "medium" | "long";
  status: "queued" | "running" | "completed" | "failed";
}
async function runTask(app: EasyApp, taskId: string) {
  const task = await app.orm.getEntity<Task>("taskQueue", taskId);
  if (!task) {
    easyLog.warning(`Task ${taskId} not found`, app.fullAppName);
    return;
  }
  task.status = "running";
  await task.save();
  easyLog.debug(task.data);
}
