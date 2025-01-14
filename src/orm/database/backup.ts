import { CommandSession } from "@vef/easy-ops";
import type { EasyApp } from "#/app/easyApp.ts";
import { dateUtils } from "#orm/utils/dateUtils.ts";
import type { DatabaseConfig } from "#orm/database/database.ts";
import { joinPath } from "#/utils.ts";

export async function backUpPgDatabase(app: EasyApp) {
  const nowFormatted = dateUtils.nowFormatted("standard", true) as string;
  const dbName =
    (app.config.ormOptions.databaseConfig as DatabaseConfig["postgres"])
      .clientOptions.database;
  const backupName = `${dbName}_backup_${
    nowFormatted.replaceAll(" ", "_").replaceAll(":", "-")
  }`;
  const filePath = joinPath(app.fileRoot, backupName);
  const session = new CommandSession("local", {
    cwd: Deno.realPathSync(app.config.appRootPath),
  });

  await session.start();
  const command = ["pg_dump", "-d", dbName, "-Fc", "-f", filePath];
  await session.runCommand(command.join(" "), true);
  session.close();
  return backupName;
}
