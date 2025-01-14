import { SettingsType } from "#orm/entry/settings/settingsType.ts";

export const systemSettings = new SettingsType("systemSettings");

systemSettings.addFieldGroups([{
  key: "general",
  title: "General",
}, {
  key: "database",
  title: "Database",
}]);

systemSettings.addFields([{
  key: "autoBackup",
  label: "Auto Backup",
  fieldType: "BooleanField",
  group: "database",
  description: "Automatically backup the database",
}, {
  key: "backupFrequency",
  label: "Backup Frequency",
  fieldType: "ChoicesField",
  description: "Frequency of database backup",
  defaultValue: "daily",
  choices: [{
    key: "daily",
    label: "Daily",
  }, {
    key: "weekly",
    label: "Weekly",
  }, {
    key: "monthly",
    label: "Monthly",
  }, {
    key: "hourly",
    label: "Hourly",
  }],
  group: "database",
}, {
  key: "lastBackupTime",
  label: "Last Backup Time",
  description: "Last time the database was backed up",
  fieldType: "TimeStampField",
  showTime: true,
  group: "database",
  readOnly: true,
}]);

systemSettings.addAction("backupDatabase", {
  label: "Backup Database",
  description: "Backup the database",
  async action(systemSettings) {
    const { orm } = systemSettings;
    const backup = await orm.createEntry(
      "databaseBackup",
      {},
      systemSettings._user,
    );
    await backup.runAction("backup");
    return "Database backup queued";
  },
});
