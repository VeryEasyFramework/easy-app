import { SettingsEntity } from "#orm/entity/settings/settingsEntity.ts";
import type { Choice } from "../../../../../vef-types/mod.ts";
import { w } from "../../../../dev/public/assets/index-CQnUWCV4.js";

export const workerSettings = new SettingsEntity("workerSettings");

workerSettings.setConfig({
  label: "Worker Settings",
  description: "Settings for the worker",
});

const workerStatusChoices: Choice[] = [{
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
}];

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

workerSettings.addFields([{
  key: "shortWorkerEnabled",
  fieldType: "BooleanField",
  label: "Short Worker Enabled",
  description: "Enable the short worker",
  defaultValue: true,
  group: "shortWorker",
}, {
  key: "shortWorkerStatus",
  fieldType: "ChoicesField",
  label: "Short Worker Status",
  description: "The status of the short worker",
  defaultValue: "idle",
  readOnly: true,
  choices: workerStatusChoices,
  group: "shortWorker",
}]);

workerSettings.addFields([{
  key: "mediumWorkerEnabled",
  fieldType: "BooleanField",
  label: "Medium Worker Enabled",
  description: "Enable the medium worker",
  defaultValue: true,

  group: "mediumWorker",
}, {
  key: "mediumWorkerStatus",
  fieldType: "ChoicesField",
  label: "Medium Worker Status",
  description: "The status of the medium worker",
  defaultValue: "idle",
  readOnly: true,
  choices: workerStatusChoices,
  group: "mediumWorker",
}]);

workerSettings.addFields([{
  key: "longWorkerEnabled",
  fieldType: "BooleanField",
  label: "Long Worker Enabled",
  description: "Enable the long worker",
  defaultValue: true,
  group: "longWorker",
}, {
  key: "longWorkerStatus",
  fieldType: "ChoicesField",
  label: "Long Worker Status",
  description: "The status of the long worker",
  defaultValue: "idle",
  readOnly: true,
  choices: workerStatusChoices,
  group: "longWorker",
}]);
