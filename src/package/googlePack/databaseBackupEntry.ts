import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { backUpPgDatabase } from "#orm/database/backup.ts";
import { dateUtils } from "#orm/utils/dateUtils.ts";
import type { DatabaseBackup } from "#/generatedTypes/databaseBackupInterface.ts";
export const databaseBackupEntry = new EntryType<DatabaseBackup>(
  "databaseBackup",
);

databaseBackupEntry.setConfig({
  titleField: "backupFileName",
});

databaseBackupEntry.addFields([
  {
    key: "backupDate",
    label: "Backup Date",
    fieldType: "TimeStampField",
    inList: true,
    readOnly: true,
  },
  {
    key: "backupFileName",
    label: "Backup File Name",
    fieldType: "DataField",
    inCreate: true,
  },
  {
    key: "uploadStatus",
    label: "Upload Status",
    fieldType: "ChoicesField",
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
]);

databaseBackupEntry.addAction("createBackup", {
  label: "Create Backup",
  async action(backup) {
    const backupFile = await backUpPgDatabase(backup.orm.app);
    backup.backupFileName = backupFile;
    backup.backupDate = dateUtils.nowTimestamp();
    await backup.save();
  },
});

databaseBackupEntry.addAction("createGoogleUpload", {
  label: "Create Google Upload",
  async action(backup) {
    const uploadEntry = await backup.orm.createEntry("googleUpload", {
      filePath: backup.backupFileName,
      fileName: backup.backupFileName,
      uploadType: "resumable",
    });
    backup.uploadEntry = uploadEntry.id;
    await backup.save();
  },
});
