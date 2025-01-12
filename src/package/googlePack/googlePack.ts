import { EasyPack, raiseEasyException } from "@vef/easy-app";
import { googleUploadEntry } from "#/package/googlePack/googleUploadEntry.ts";
import {
  getAccessToken,
  googleSettings,
} from "#/package/googlePack/googleSettings.ts";
import { redirectAction } from "#/package/googlePack/actions/redirectAction.ts";
import { getOAuthUrl } from "#/package/googlePack/actions/getOAuthUrl.ts";
import { backUpDatabase } from "#/package/googlePack/actions/backupDatabase.ts";

export const googlePack = new EasyPack("google", {
  description: "Google API",
});

googlePack.addEntryType(googleUploadEntry);

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

googlePack.addAction("google", getOAuthUrl);

googlePack.addAction("google", redirectAction);
googlePack.addAction("google", backUpDatabase);
