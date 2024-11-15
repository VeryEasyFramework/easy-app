import { EasyPack } from "#/package/easyPack.ts";
import { taskQueue } from "#/package/workersPack/entryTypes/taskQueue.ts";
import { workerSettings } from "#/package/workersPack/entryTypes/workerSettings.ts";

export const workersPack = new EasyPack("workersPack");

workersPack.addEntryType(taskQueue);
workersPack.addSettingsType(workerSettings);
