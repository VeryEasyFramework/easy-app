import { EasyWorker } from "#/workers/task.ts";
import { app } from "/home/eliveffer/VeryEasyFramework/app-orm/easy-app/dev/app.ts";
const queue = new EasyWorker(
  app,
);
