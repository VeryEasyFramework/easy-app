import { SettingsEntity } from "#orm/entity/settings/settingsEntity.ts";
import type { Choice, EasyField } from "@vef/types";
import startProcess from "#/app/runner/startProcess.ts";
import { toTitleCase } from "@vef/string-utils";
import { easyLog } from "#/log/logging.ts";

export const workerSettings = new SettingsEntity("workerSettings");

workerSettings.setConfig({
  label: "Worker Settings",
  description: "Settings for the worker",
});

workerSettings.addFieldGroups([{
  key: "shared",
  title: "Shared Settings",
  description: "Shared settings for all workers",
}, {
  key: "shortWorker",
  title: "Short Worker",
}, {
  key: "mediumWorker",
  title: "Medium Worker",
}, {
  key: "longWorker",
  title: "Long Worker",
}]);

const workerFields: Record<string, EasyField[]> = {
  short: [],
  medium: [],
  long: [],
};
workerSettings.addFields([
  {
    key: "maxTaskCount",
    fieldType: "IntField",
    label: "Max Concurrent Tasks",
    description:
      `The maximum number of tasks that can be run concurrently for each worker`,
    defaultValue: 5,
    group: "shared",
  },
  {
    key: "waitInterval",
    fieldType: "IntField",
    label: "Wait Interval",
    description:
      `The interval in seconds to wait before checking for new tasks`,
    defaultValue: 60,
    group: "shared",
  },
]);
Object.keys(workerFields).forEach((worker) => {
  const title = toTitleCase(worker);
  workerFields[worker] = [
    {
      key: `${worker}WorkerEnabled`,
      fieldType: "BooleanField",
      label: "Enabled",
      description: `Enable the ${worker} worker`,
      defaultValue: true,
      group: `${worker}Worker`,
    },
    {
      key: `${worker}WorkerStatus`,
      fieldType: "ChoicesField",
      label: "Status",
      description: `The status of the ${worker} worker`,
      defaultValue: "idle",
      readOnly: true,
      choices: [{
        key: "ready",
        label: "Ready",
        color: "success",
      }, {
        key: "running",
        label: "Running",
        color: "warning",
      }, {
        key: "stopped",
        label: "Stopped",
      }],
      group: `${worker}Worker`,
    },
    {
      key: `${worker}WorkerPid`,
      fieldType: "IntField",
      label: "Worker PID",
      description: `The PID of the ${worker} worker`,
      readOnly: true,
      group: `${worker}Worker`,
    },
    {
      key: `${worker}QueuedTasks`,
      fieldType: "IntField",
      label: "Queued Tasks",
      description: `The number of tasks queued for the ${worker} worker`,
      readOnly: true,
      group: `${worker}Worker`,
    },
    {
      key: `${worker}RunningTasks`,
      fieldType: "IntField",
      label: "Running Tasks",
      description: `The number of tasks running for the ${worker} worker`,
      readOnly: true,
      group: `${worker}Worker`,
    },
    {
      key: `${worker}CompletedTasks`,
      fieldType: "IntField",
      label: "Completed Tasks",
      description: `The number of tasks completed for the ${worker} worker`,
      readOnly: true,
      group: `${worker}Worker`,
    },
    {
      key: `${worker}FailedTasks`,
      fieldType: "IntField",
      label: "Failed Tasks",
      description: `The number of tasks failed for the ${worker} worker`,
      readOnly: true,
      group: `${worker}Worker`,
    },
  ];
});

workerSettings.addFields(workerFields.short);
workerSettings.addFields(workerFields.medium);
workerSettings.addFields(workerFields.long);

workerSettings.addHook("beforeSave", {
  label: "Toggle Workers",
  action(settings) {
    const workers = ["short", "medium", "long"];

    for (const worker of workers) {
      const enabled = settings[`${worker}WorkerEnabled`] as boolean;
      const pid = settings[`${worker}WorkerPid`] as number;
      if (enabled && !pid) {
        const title = `Worker - ${toTitleCase(worker)}`;
        const process = startProcess(title, {
          args: ["--worker", worker],
        });
        settings[`${worker}WorkerStatus`] = "ready";
        settings[`${worker}WorkerPid`] = process.process.pid;
        settings.orm.app.processes.push(process);
      }
      if (!enabled && pid) {
        try {
          Deno.kill(pid, "SIGTERM");
        } catch (e) {
          if (e instanceof Deno.errors.NotFound) {
            // Worker already stopped
          } else {
            throw e;
          }
        }
        settings[`${worker}WorkerPid`] = null;
        settings[`${worker}WorkerStatus`] = "stopped";
      }
    }
  },
});

workerSettings.addAction("updateTaskCount", {
  async action(settings) {
    const results = await settings.orm.countGrouped("taskQueue", [
      "worker",
      "status",
    ]);
    const workerCounts: Record<string, Record<string, number>> = {
      short: {
        queued: 0,
        running: 0,
        completed: 0,
        failed: 0,
      },
      medium: {
        queued: 0,
        running: 0,
        completed: 0,
        failed: 0,
      },
      long: {
        queued: 0,
        running: 0,
        completed: 0,
        failed: 0,
      },
    };
    results.forEach((result) => {
      workerCounts[result.worker][result.status] = result.count;
    });

    for (const worker of ["short", "medium", "long"]) {
      settings[`${worker}QueuedTasks`] = workerCounts[worker].queued;
      settings[`${worker}RunningTasks`] = workerCounts[worker].running;
      settings[`${worker}CompletedTasks`] = workerCounts[worker].completed;
      settings[`${worker}FailedTasks`] = workerCounts[worker].failed;
    }

    settings.save();
    return results;
  },
});
