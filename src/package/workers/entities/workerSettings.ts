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

Object.keys(workerFields).forEach((worker) => {
  workerFields[worker].push({
    key: `${worker}WorkerEnabled`,
    fieldType: "BooleanField",
    label: `${worker} Worker Enabled`,
    description: `Enable the ${worker} worker`,
    defaultValue: true,
    group: `${worker}Worker`,
  });
  workerFields[worker].push({
    key: `${worker}WorkerStatus`,
    fieldType: "ChoicesField",
    label: `${worker} Worker Status`,
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
  });
  workerFields[worker].push({
    key: `${worker}WorkerPid`,
    fieldType: "IntField",
    label: `${worker} Worker PID`,
    description: `The PID of the ${worker} worker`,
    readOnly: true,
    group: `${worker}Worker`,
  });
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
