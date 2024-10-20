import { EasyPack } from "#/package/easyPack.ts";
import { taskQueue } from "#/package/workers/entities/taskQueue.ts";
import { workerSettings } from "#/package/workers/entities/workerSettings.ts";

export const workersPack = new EasyPack("workersPack");

workersPack.addEntity(taskQueue);
workersPack.addSettingsEntity(workerSettings);
