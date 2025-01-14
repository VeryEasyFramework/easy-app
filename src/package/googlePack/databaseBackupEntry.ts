import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { backUpPgDatabase } from "#orm/database/backup.ts";
import { dateUtils } from "#orm/utils/dateUtils.ts";
import type { DatabaseBackup } from "#/generatedTypes/databaseBackupInterface.ts";
import { joinPath } from "#/utils.ts";
export const databaseBackupEntry = new EntryType<DatabaseBackup>(
  "databaseBackup",
);

databaseBackupEntry.setConfig({
  statusField: "uploadStatus",
});

databaseBackupEntry.addFields([
  {
    key: "backupDate",
    label: "Backup Date",
    fieldType: "TimeStampField",
    showTime: true,
    inList: true,
    readOnly: true,
  },
  {
    key: "backupFileName",
    label: "Backup File Name",
    fieldType: "DataField",
    inList: true,
    defaultValue: "",
  },
  {
    key: "uploadStatus",
    label: "Upload Status",
    defaultValue: "pending",
    fieldType: "ChoicesField",
    inList: true,
    choices: [{
      key: "pending",
      label: "Pending",
    }, {
      key: "inProgress",
      label: "In Progress",
    }, {
      key: "completed",
      label: "Completed",
    }, {
      key: "failed",
      label: "Failed",
    }],
    readOnly: true,
    fetchOptions: {
      fetchEntryType: "googleUpload",
      thisIdKey: "uploadEntry",
      thatFieldKey: "uploadStatus",
      thisFieldKey: "uploadStatus",
    },
  },
  {
    key: "fileUrl",
    label: "File URL",
    fieldType: "URLField",
    inList: true,
    readOnly: true,
    fetchOptions: {
      fetchEntryType: "googleUpload",
      thisIdKey: "uploadEntry",
      thatFieldKey: "fileLink",
      thisFieldKey: "fileUrl",
    },
  },
  {
    key: "uploadEntry",
    label: "Upload Entry",
    fieldType: "ConnectionField",
    connectionEntryType: "googleUpload",
    inList: true,
  },
  {
    key: "savedLocally",
    label: "Saved Locally",
    fieldType: "BooleanField",
    readOnly: true,
  },
]);
databaseBackupEntry.addAction("backup", {
  label: "Backup",
  async action(backup) {
    await backup.enqueueAction("createBackup");
  },
});

databaseBackupEntry.addAction("deleteLocalBackup", {
  label: "Delete Local Backup",
  async action(backup) {
    const { app } = backup.orm;
    const fileName = backup.backupFileName;
    if (!fileName) {
      return {
        status: "failed",
        message: "No backup file found",
      };
    }
    const path = joinPath(app.fileRoot, fileName);
    try {
      await Deno.remove(path);
      backup.savedLocally = false;
      await backup.save();
      return {
        status: "completed",
      };
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        backup.savedLocally = false;
        await backup.save();
        return {
          status: "completed",
        };
      }
      throw error;
    }
  },
});
databaseBackupEntry.addAction("createBackup", {
  label: "Create Backup",
  private: true,
  async action(backup) {
    const backupFile = await backUpPgDatabase(backup.orm.app);
    backup.backupFileName = backupFile;
    backup.backupDate = dateUtils.nowTimestamp();
    backup.savedLocally = true;
    await backup.save();
    await backup.runAction("uploadBackup");
    const fileUrl = await backup.orm.getValue(
      "databaseBackup",
      backup.id,
      "fileUrl",
    );
    if (fileUrl) {
      await backup.runAction("deleteLocalBackup");
      const settings = await backup.orm.getSettings("systemSettings");
      settings.lastBackupTime = backup.backupDate;
      await settings.save();
    }
    return {
      status: "completed",
    };
  },
});

databaseBackupEntry.addAction("uploadBackup", {
  label: "Upload Backup",
  private: true,
  async action(backup) {
    const uploadEntry = await backup.orm.createEntry("googleUpload", {
      filePath: backup.backupFileName,
      fileName: backup.backupFileName,
      uploadType: "resumable",
    });
    backup.uploadEntry = uploadEntry.id;
    await backup.save();
    await uploadEntry.runAction("upload");
    // await backup.save();
  },
});
