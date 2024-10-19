import { EasyEntity } from "#orm/entity/entity/entityDefinition/easyEntity.ts";
import { raiseOrmException } from "#orm/ormException.ts";

export const taskQueue = new EasyEntity("taskQueue");
taskQueue.setConfig({
  statusField: "status",
  titleField: "title",
});
taskQueue.addFields([{
  key: "taskType",
  fieldType: "ChoicesField",
  defaultValue: "entity",
  required: true,
  readOnly: true,
  choices: [{
    key: "entity",
    label: "Entity",
  }, {
    key: "settings",
    label: "Settings",
  }, {
    key: "app",
    label: "App",
  }],
}, {
  key: "recordType",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "recordId",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "recordTitle",
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
      case "entity": {
        const entity = task.recordType as string;
        const def = task.orm.getEntityDef(entity);
        if (!def) {
          raiseOrmException("EntityNotFound", `Entity ${entity} not found`);
        }
        title = `${def.config.label}: ${task.recordTitle} - ${task.action}`;
        break;
      }
      case "settings": {
        const settings = task.recordType as string;
        const def = task.orm.getSettingsEntity(settings);

        if (!def) {
          raiseOrmException("EntityNotFound", `Settings ${settings} not found`);
        }

        title = `${def.config.label}: - ${task.action}`;
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
      case "entity": {
        const entity = task.recordType as string;
        const recordId = task.recordId as string;
        const action = task.action as string;
        const data = task.taskData as Record<string, any>;

        const record = await task.orm.getEntity(entity, recordId);
        task.status = "running";
        await task.save();
        const result = await record.runAction(action, data);
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
