import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { raiseOrmException } from "#orm/ormException.ts";

export const taskQueue = new EntryType("taskQueue");
taskQueue.setConfig({
  statusField: "status",
  titleField: "title",
});
taskQueue.addFields([{
  key: "taskType",
  fieldType: "ChoicesField",
  defaultValue: "entry",
  required: true,
  readOnly: true,
  choices: [{
    key: "entry",
    label: "Entry",
  }, {
    key: "settings",
    label: "Settings",
  }, {
    key: "app",
    label: "App",
  }],
}, {
  key: "entryType",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "entryId",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "entryTitle",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "action",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "taskData",
  fieldType: "JSONField",
  readOnly: true,
}, {
  key: "title",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "worker",
  fieldType: "ChoicesField",
  defaultValue: "medium",
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
  key: "resultData",
  fieldType: "JSONField",
  readOnly: true,
}, {
  key: "status",
  fieldType: "ChoicesField",
  defaultValue: "queued",
  required: true,
  inList: true,
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

taskQueue.addHook("validate", {
  action(task) {
    let title = "";
    switch (task.taskType) {
      case "entry": {
        const entryType = task.recordType as string;
        const entryTypeDef = task.orm.getEntryType(entryType);
        if (!entryTypeDef) {
          raiseOrmException(
            "EntryTypeNotFound",
            `Entry Type ${entryType} not found`,
          );
        }
        title =
          `${entryTypeDef.config.label}: ${task.recordTitle} - ${task.action}`;
        break;
      }
      case "settings": {
        const settingsType = task.recordType as string;
        const settingsTypeDef = task.orm.getSettingsType(settingsType);

        if (!settingsTypeDef) {
          raiseOrmException(
            "EntryTypeNotFound",
            `Settings ${settingsType} not found`,
          );
        }

        title = `${settingsTypeDef.config.label}: - ${task.action}`;
        break;
      }
    }
    // const recordType =
    task.title = title;
  },
});

taskQueue.addHook("afterSave", {
  async action(task) {
    const settings = await task.orm.getSettings("workerSettings");
    settings.runAction("updateTaskCount");
  },
});

taskQueue.addHook("afterDelete", {
  async action(task) {
    const settings = await task.orm.getSettings("workerSettings");
    settings.runAction("updateTaskCount");
  },
});

taskQueue.addAction("runTask", {
  async action(task) {
    switch (task.taskType) {
      case "entry": {
        const entryType = task.entryType as string;
        const entryId = task.entryId as string;
        const action = task.action as string;
        const data = task.taskData as Record<string, any>;

        const entry = await task.orm.getEntry(entryType, entryId);
        task.status = "running";
        await task.save();
        const result = await entry.runAction(action, data);
        if (!result) {
          break;
        }
        let message = result;
        if (typeof result !== "object") {
          message = {
            message: result,
          };
        }
        task.resultData = message;
      }
    }
    task.status = "completed";
    await task.save();
  },
});
