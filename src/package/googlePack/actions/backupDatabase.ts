import { createAction } from "#/actions/createAction.ts";
import { DatabaseConfig } from "#orm/database/database.ts";
import { formatUtils } from "@vef/easy-cli";
import { dateUtils } from "#orm/utils/dateUtils.ts";

export const backUpDatabase = createAction("backupDatabase", {
  system: false,
  description: "Backup the database",
  async action(app, data, request, response) {
    const path = app.fileRoot;
    const config = app.config.ormOptions
      .databaseConfig as DatabaseConfig["postgres"];
    const databaseName = config.clientOptions.database;
    const date = dateUtils.now();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${day}_${hour}-${minute}-${second}`;

    const backupName = `${databaseName}_backup_${dateStr}`;
    const command = new Deno.Command("pg_dump", {
      stdout: "piped",
      stderr: "piped",
      args: [
        "-d",
        databaseName,
        "-Fc",
        "-f",
        backupName,
      ],
      cwd: Deno.realPathSync(path),
    });
    const process = command.spawn();

    //  await process.status;
    const result = await process.output();
    if (result.success) {
      const upload = await app.orm.createEntry("googleUpload", {
        uploadType: "resumable",
        filePath: backupName,
        fileName: backupName,
      });
      await upload.runAction("createSessionUri");
      const uploadEntry = await app.orm.getEntry("googleUpload", upload.id);
      await uploadEntry.enqueueAction("upload");
      return uploadEntry.data;
    }
    return result;
    // const fileName = app.config
  },
});
