import { EasyPack } from "#/package/easyPack.ts";
import { emailEntry } from "#/package/emailPack/entryTypes/emailEntry.ts";
import { sendEmailAction } from "#/package/emailPack/actions/sendEmailAction.ts";
import { emailSettings } from "#/package/emailPack/settingsTypes/emailSettings.ts";
import { emailAccountEntry } from "#/package/emailPack/entryTypes/emailAccountEntry.ts";
import { redirectAction } from "#/package/emailPack/actions/googleRedirectAction.ts";

export const emailPack: EasyPack = new EasyPack("emailPack");

emailPack.addEntryType(emailEntry);
emailPack.addEntryType(emailAccountEntry);
emailPack.addSettingsType(emailSettings);

emailPack.addAction("email", sendEmailAction);
emailPack.addAction("email", redirectAction);
