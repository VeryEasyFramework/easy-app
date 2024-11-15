import { SMTPClient } from "#/package/emailPack/smtp/smtpClient.ts";
import type { SMTPOptions } from "#/package/emailPack/smtp/smtpTypes.ts";
import { EntryType } from "../../../orm/entry/entry/entryType/entryType.ts";

export const emailEntity = new EntryType("email");

emailEntity.setConfig({
  label: "Email",
  description: "An email",
});

emailEntity.addFields([{
  key: "senderEmail",
  fieldType: "EmailField",
  label: "Sender's Email",
  description: "The email address of the sender",
  inList: true,
  readOnly: true,
}, {
  key: "senderName",
  fieldType: "DataField",
  label: "Sender's Name",
  description: "The name of the sender",
}, {
  key: "recipientName",
  fieldType: "DataField",
  label: "Recipient's Name",
  description: "The name of the recipient",
}, {
  key: "recipientEmail",
  fieldType: "EmailField",
  label: "Recipient's Email",
  description: "The email address of the recipient",
  required: true,
  inList: true,
}, {
  key: "subject",
  fieldType: "TextField",
  label: "Subject",
  description: "The subject of the email",
}, {
  key: "contentType",
  fieldType: "ChoicesField",
  label: "Content Type",
  description: "The content type of the email",
  defaultValue: "html",
  choices: [
    { key: "html", label: "HTML", color: "success" },
    { key: "text", label: "Text", color: "warning" },
  ],
}, {
  key: "body",
  fieldType: "TextField",
  label: "Body",
  description: "The body of the email",
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
    entity.senderEmail = settings.emailAccount as string;
    const config: SMTPOptions = {
      port: settings.smtpPort as number || 587,
      smtpServer: settings.smtpHost as string,
      userLogin: settings.smtpUser as string,
      password: settings.smtpPassword as string,
      domain: "localhost",
    };
    try {
      const body = entity.body as string || "";

      const smtpClient = new SMTPClient(config);
      smtpClient.onError = (code, message) => {
        console.error(`SMTP Error: ${code} ${message}`);
        throw new Error(`SMTP Error: ${code} ${message}`);
      };
      smtpClient.onStateChange = (state, message) => {
      };
      await smtpClient.sendEmail({
        body,
        header: {
          from: {
            email: entity.senderEmail as string,
            name: entity.senderName as string,
          },
          to: {
            email: entity.recipientEmail as string,
            name: entity.recipientName as string,
          },
          subject: entity.subject as string,
          contentType: entity.contentType as "html" | "text",
          date: new Date(),
        },
      });
      // Send the email
      entity.status = "sent";
      await entity.save();
    } catch (_e) {
      entity.status = "failed";
      await entity.save();
    }
  },
});
