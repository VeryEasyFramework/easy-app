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
  key: "status",
  fieldType: "ChoicesField",
  defaultValue: "pending",
  required: true,
  readOnly: true,
  choices: [{
    key: "pending",
    label: "Pending",
    color: "warning",
  }, {
    key: "running",
    label: "Running",
    color: "primary",
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
