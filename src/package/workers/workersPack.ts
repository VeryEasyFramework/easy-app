import { EasyPack } from "#/package/easyPack.ts";
import { taskQueue } from "#/package/workers/entities/taskQueue.ts";
import { workerSettings } from "#/package/workers/entities/workerSettings.ts";
import { scheduledTask } from "#/package/workers/entities/scheduledTask.ts";

export const workersPack = new EasyPack("workersPack");

workersPack.addEntity(taskQueue);
workersPack.addEntity(scheduledTask);
workersPack.addSettingsEntity(workerSettings);
