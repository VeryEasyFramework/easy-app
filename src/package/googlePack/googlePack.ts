import { googleUploadEntry } from "#/package/googlePack/googleUploadEntry.ts";
import { googleSettings } from "#/package/googlePack/googleSettings.ts";
import { redirectAction } from "#/package/googlePack/actions/redirectAction.ts";
import { backUpDatabase } from "#/package/googlePack/actions/backupDatabase.ts";
import { databaseBackupEntry } from "#/package/googlePack/databaseBackupEntry.ts";
import { EasyPack } from "#/package/easyPack.ts";

export const googlePack: EasyPack = new EasyPack("google", {
  description: "Google API",
});

googlePack.addEntryType(googleUploadEntry);
googlePack.addEntryType(databaseBackupEntry);
googlePack.addSettingsType(googleSettings);

googlePack.addAction("google", redirectAction);
googlePack.addAction("google", backUpDatabase);
