import type { EasyApp } from "#/app/easyApp.ts";

import { dateUtils } from "#orm/utils/dateUtils.ts";
import { easyLog } from "#/log/logging.ts";
import type { BootAction } from "#/types.ts";
import { prettyDuration } from "@vef/string-utils";

export async function scheduleDatabaseBackup(app: EasyApp) {
}
const dayMs = 24 * 60 * 60 * 1000;
const hourMs = 60 * 60 * 1000;
const weekMs = 7 * dayMs;
const monthMs = 30 * dayMs;
const minuteMs = 60 * 1000;

export const addDatabaseBackupScheduler: BootAction = {
  actionName: "addDatabaseBackupScheduler",
  description: "Schedule database backups",
  action(app) {
    app.addWorkerHook("medium", async (app) => {
      const systemSettings = await app.orm.getSettings("systemSettings");
      const autoBackup = systemSettings.autoBackup;
      const backupFrequency = systemSettings.backupFrequency;
      const lastBackupTime = systemSettings.lastBackupTime;

      if (!autoBackup) {
        return;
      }
      let shouldBackup = false;

      if (!lastBackupTime) {
        shouldBackup = true;
      }
      if (lastBackupTime) {
        const now = dateUtils.nowTimestamp();
        const diff = now - lastBackupTime;
        const prettyLastBackup = prettyDuration(diff);
        switch (backupFrequency) {
          case "daily":
            shouldBackup = diff > dayMs;
            break;
          case "hourly":
            shouldBackup = diff > hourMs;
            break;
          case "monthly":
            shouldBackup = diff > monthMs;
            break;
          case "weekly":
            shouldBackup = diff > weekMs;
            break;
          case "minutely":
            shouldBackup = diff > minuteMs;
            break;
        }
      }
      if (shouldBackup) {
        await systemSettings.runAction("backupDatabase");
      }
    });
  },
};
