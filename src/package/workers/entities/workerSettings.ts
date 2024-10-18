import { SettingsEntity } from "#orm/entity/settings/settingsEntity.ts";
import type { Choice, EasyField } from "@vef/types";

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
      key: "idle",
      label: "Idle",
      color: "muted",
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

workerSettings.addAction("stopWorker", {
  label: "Stop Worker",
  description: "Stop the worker",
  async action(settings, { worker }) {
  },
  params: [{
    key: "worker",
    fieldType: "ChoicesField",
    label: "Worker",
    description: "The worker to stop",
    choices: [{
      key: "short",
      label: "Short Worker",
    }, {
      key: "medium",
      label: "Medium Worker",
    }, {
      key: "long",
      label: "Long Worker",
    }],
  }],
});
