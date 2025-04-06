import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { raiseOrmException } from "#orm/ormException.ts";
import type { EasyOrm } from "#orm/orm.ts";
import type { TaskQueue } from "#/generatedTypes/taskQueueInterface.ts";
import { EasyRequest } from "#/app/easyRequest.ts";
import { EasyResponse } from "#/app/easyResponse.ts";
import { dateUtils } from "#orm/utils/dateUtils.ts";

export const taskQueue = new EntryType<TaskQueue>("taskQueue");
taskQueue.setConfig({
  statusField: "status",
  titleField: "title",
  orderField: "queuedAt",
  orderDirection: "desc",
});

taskQueue.addFieldGroups([{
  key: "details",
  title: "Details",
}]);
taskQueue.addFields([{
  key: "taskType",
  fieldType: "ChoicesField",
  defaultValue: "entry",
  required: true,
  readOnly: true,
  inList: true,
  group: "details",
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
  inList: true,
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
  key: "group",
  fieldType: "DataField",
  inList: true,
  readOnly: true,
}, {
  key: "action",
  inList: true,
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
    key: "cancelled",
    label: "Cancelled",
    color: "error",
  }, {
    key: "completed",
    label: "Completed",
    color: "success",
  }, {
    key: "failed",
    label: "Failed",
    color: "error",
  }],
}, {
  key: "queuedAt",
  label: "Queued At",
  fieldType: "TimeStampField",
  readOnly: true,
  inList: true,
  showTime: true,
  group: "details",
}, {
  key: "startTime",
  label: "Start Time",
  fieldType: "TimeStampField",
  readOnly: true,
  inList: true,
  showTime: true,
  group: "details",
}, {
  key: "endTime",
  label: "End Time",
  fieldType: "TimeStampField",
  readOnly: true,
  inList: true,
  showTime: true,
  group: "details",
}]);

taskQueue.addHook("validate", {
  action(task) {
    const orm = task.orm as EasyOrm;
    let title = "";
    switch (task.taskType) {
      case "entry": {
        const entryType = task.entryType as string;
        const entryTypeDef = orm.getEntryType(entryType);
        if (!entryTypeDef) {
          raiseOrmException(
            "EntryTypeNotFound",
            `Entry Type ${entryType} not found`,
          );
        }
        title =
          `${entryTypeDef.config.label}: ${task.entryTitle} - ${task.action}`;
        break;
      }
      case "settings": {
        const settingsType = task.entryType as string;
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
    await settings.runAction("updateTaskCount");
  },
});

taskQueue.addHook("afterDelete", {
  async action(task) {
    const settings = await task.orm.getSettings("workerSettings");
    await settings.runAction("updateTaskCount");
  },
});
taskQueue.addHook("beforeSave", {
  label: "Set Times",
  action(task) {
    if (task.isValueChanged("status")) {
      switch (task.status) {
        case "running":
          task.startTime = dateUtils.nowTimestamp();
          break;
        case "completed":
        case "failed":
          task.endTime = dateUtils.nowTimestamp();
          if (!task.startTime) {
            task.startTime = dateUtils.nowTimestamp();
          }
          break;
        case "queued":
          task.queuedAt = dateUtils.nowTimestamp();
          break;
        default:
          break;
      }
    }
  },
});

taskQueue.addHook("beforeInsert", {
  label: "Set Queued At",
  action(task) {
    if (!task.queuedAt) {
      task.queuedAt = dateUtils.nowTimestamp();
    }
  },
});
taskQueue.addAction("cancel", {
  label: "Cancel Task",
  async action(task) {
    switch (task.status) {
      case "queued":
      case "running":
        task.status = "cancelled";
        await task.save();
        break;
      default:
        break;
    }
  },
});
taskQueue.addAction("runTask", {
  label: "Run Task",
  async action(task) {
    try {
      let result;
      const entryType = task.entryType as string;
      const entryId = task.entryId as string;
      const group = task.group as string;
      const action = task.action as string;
      const data = task.taskData as Record<string, any>;
      task.status = "running";
      await task.save();

      switch (task.taskType) {
        case "entry": {
          const entry = await task.orm.getEntry(entryType, entryId);
          result = await entry.runAction(action, data);

          break;
        }
        case "settings": {
          const settings = await task.orm.getSettings(entryType);
          result = await settings.runAction(action, data);
          break;
        }
        case "app": {
          const app = task.orm.app;
          result = await app.runAction(group, action, {
            data,
            request: new EasyRequest(new Request("")),
            response: new EasyResponse(),
          });
          break;
        }
      }
      switch (typeof result) {
        case "object":
          task.resultData = result;
          break;
        case "string":
        case "number":
          task.resultData = {
            message: result,
          };
          break;
        default:
          break;
      }

      task.status = "completed";
      await task.save();
    } catch (e: unknown) {
      let message = "Error running task";
      let error = "";
      if (e instanceof Error) {
        message = e.message;
        error = e.name;
      }
      task.resultData = {
        error,
        message,
      };
      task.status = "failed";
      await task.save();
    }
  },
});
