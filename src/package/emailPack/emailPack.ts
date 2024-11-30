import { EasyPack } from "#/package/easyPack.ts";
import { emailEntry } from "#/package/emailPack/entryTypes/emailEntry.ts";
import { sendEmailAction } from "#/package/emailPack/actions/sendEmailAction.ts";
import { emailSettings } from "#/package/emailPack/settingsTypes/emailSettings.ts";

export const emailPack: EasyPack = new EasyPack("emailPack");

emailPack.addEntryType(emailEntry);
emailPack.addSettingsType(emailSettings);

emailPack.addAction("email", sendEmailAction);
