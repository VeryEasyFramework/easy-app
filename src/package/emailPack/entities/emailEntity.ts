import { EasyEntity } from "@vef/easy-orm";
import { raiseEasyException } from "#/easyException.ts";
import { SMTPClient } from "#/package/emailPack/smtp/smtpClient.ts";
import { SMTPOptions } from "#/package/emailPack/smtp/smtpTypes.ts";
import s from "../../../../dev/public/assets/RealtimeView-DFnO67FO.js";

export const emailEntity = new EasyEntity("email");

emailEntity.setConfig({
  label: "Email",
  description: "An email",
});

emailEntity.addFields([{
  key: "sender",
  fieldType: "EmailField",
  label: "Sender",
  description: "The email address of the sender",
  inList: true,
  readOnly: true,
}, {
  key: "recipient",
  fieldType: "EmailField",
  label: "Recipient",
  description: "The email address of the recipient",
  required: true,
  inList: true,
}, {
  key: "subject",
  fieldType: "TextField",
  label: "Subject",
  description: "The subject of the email",
}, {
  key: "body",
  fieldType: "TextField",
  label: "Body",
  description: "The body of the email",
  required: true,
}, {
  key: "status",
  fieldType: "ChoicesField",
  label: "Status",
  description: "The status of the email",
  defaultValue: "pending",
  readOnly: true,
  inList: true,
  choices: [
    { key: "pending", label: "Pending", color: "warning" },
    { key: "sent", label: "Sent", color: "success" },
    { key: "failed", label: "Failed", color: "error" },
  ],
}]);

emailEntity.addAction("send", {
  description: "Send the email",
  async action(entity) {
    if (entity.status !== "pending") {
      entity.status = "pending";
      // raiseEasyException("Email has already been sent", 400);
      await entity.save();
    }
    const settings = await entity.orm.getSettings("emailSettings");
    entity.sender = settings.emailAccount as string;
    const config: SMTPOptions = {
      port: settings.smtpPort as number || 587,
      smtpServer: settings.smtpHost as string,
      userLogin: settings.smtpUser as string,
      password: settings.smtpPassword as string,
      domain: "localhost",
    };
    try {
      const smtpClient = new SMTPClient(config);
      await smtpClient.connect();
      await smtpClient.send(
        entity.sender as string,
        entity.recipient as string,
        entity.subject as string,
        entity.body as string,
      );
      // Send the email
      entity.status = "sent";
      await entity.save();
      smtpClient.disconnect();
    } catch (e) {
      entity.status = "failed";
      await entity.save();
    }
  },
});
