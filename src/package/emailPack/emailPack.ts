import { EasyPack } from "#/package/easyPack.ts";
import { emailEntity } from "#/package/emailPack/entities/emailEntity.ts";
import { sendEmailAction } from "#/package/emailPack/actions/sendEmailAction.ts";
import { emailSettings } from "#/package/emailPack/settings/emailSettings.ts";

export const emailPack: EasyPack = new EasyPack("emailPack");

emailPack.addEntity(emailEntity);
emailPack.addSettingsEntity(emailSettings);

emailPack.addAction("email", sendEmailAction);
