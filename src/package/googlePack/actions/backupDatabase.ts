import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";

export const backUpDatabase = createAction("backupDatabase", {
  system: false,
  description: "Backup the database",
  async action(app, data, request, response) {
    if (!request.user) {
      raiseEasyException("Not allowed", 403);
    }
    const isAdmin = await app.orm.getValue<boolean>(
      "user",
      request.user?.id,
      "systemAdmin",
    );
    if (!isAdmin) {
      raiseEasyException("Not allowed", 403);
    }
    const backup = await app.orm.createEntry("databaseBackup", {});
    await backup.runAction("backup");
    return {
      message: "Database backup started",
    };
  },
});
