import { EasyPack, raiseEasyException } from "@vef/easy-app";
import { googleUploadEntry } from "#/package/googlePack/googleUploadEntry.ts";
import {
  getAccessToken,
  googleSettings,
} from "#/package/googlePack/googleSettings.ts";
import { redirectAction } from "#/package/googlePack/actions/redirectAction.ts";
import { backUpDatabase } from "#/package/googlePack/actions/backupDatabase.ts";
import { databaseBackupEntry } from "#/package/googlePack/databaseBackupEntry.ts";

export const googlePack = new EasyPack("google", {
  description: "Google API",
});

googlePack.addEntryType(googleUploadEntry);
googlePack.addEntryType(databaseBackupEntry);
googlePack.addSettingsType(googleSettings);

// googlePack.addAction("google", {
//   description: "Backup database to Google Drive",
//   actionName: "backupDatabase",
//   async action(app, data, request, response) {
//     const upload = await app.orm.createEntry("googleUpload", {
//       uploadType: "resumable",
//       filePath: "test.txt",
//     });
//     return upload.data;
//   },
// });

googlePack.addAction("google", redirectAction);
googlePack.addAction("google", backUpDatabase);
