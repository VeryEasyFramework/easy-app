import { createAction } from "#/actions/createAction.ts";
import { DatabaseConfig } from "#orm/database/database.ts";
import { formatUtils } from "@vef/easy-cli";
import { dateUtils } from "#orm/utils/dateUtils.ts";
import { backUpPgDatabase } from "#orm/database/backup.ts";

export const backUpDatabase = createAction("backupDatabase", {
  system: false,
  description: "Backup the database",
  async action(app, data, request, response) {
    return await backUpPgDatabase(app);

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
