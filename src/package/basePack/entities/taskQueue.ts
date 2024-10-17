import { EasyEntity } from "#orm/entity/entity/entityDefinition/easyEntity.ts";

export const taskQueue = new EasyEntity("taskQueue");
taskQueue.setConfig({
  statusField: "status",
});
taskQueue.addFields([{
  key: "taskType",
  fieldType: "ChoicesField",
  defaultValue: "entity",
  required: true,
  choices: [{
    key: "entity",
    label: "Entity",
  }, {
    key: "app",
    label: "App",
  }],
}, {
  key: "recordType",
  fieldType: "DataField",
}, {
  key: "recordId",
  fieldType: "DataField",
}, {
  key: "action",
  fieldType: "DataField",
}, {
  key: "taskData",
  fieldType: "JSONField",
}, {
  key: "worker",
  fieldType: "ChoicesField",
  defaultValue: "short",
  required: true,
  choices: [{
    key: "short",
    label: "Short",
  }, {
    key: "medium",
    label: "Medium",
  }, {
    key: "long",
    label: "Long",
  }],
}, {
  key: "status",
  fieldType: "ChoicesField",
  defaultValue: "queued",
  required: true,
  readOnly: true,
  choices: [{
    key: "queued",
    label: "Queued",
    color: "muted",
  }, {
    key: "running",
    label: "Running",
    color: "warning",
  }, {
    key: "completed",
    label: "Completed",
    color: "success",
  }, {
    key: "failed",
    label: "Failed",
    color: "error",
  }],
}]);
