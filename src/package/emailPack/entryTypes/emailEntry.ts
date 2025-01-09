import { SMTPClient } from "#/package/emailPack/smtp/smtpClient.ts";
import type { SMTPOptions } from "#/package/emailPack/smtp/smtpTypes.ts";
import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { easyLog } from "#/log/logging.ts";

export const emailEntry = new EntryType("email");

emailEntry.setConfig({
  label: "Email",
  description: "An email",
});

emailEntry.addFields([{
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

emailEntry.addAction("send", {
  description: "Send the email",
  async action(email) {
    if (email.status !== "pending") {
      email.status = "pending";
      // raiseEasyException("Email has already been sent", 400);
      await email.save();
    }
    const settings = await email.orm.getSettings("emailSettings");
    email.senderEmail = settings.emailAccount as string;
    const config: SMTPOptions = {
      port: settings.smtpPort as number || 587,
      smtpServer: settings.smtpHost as string,
      userLogin: settings.smtpUser as string,
      password: settings.smtpPassword as string,
      domain: "localhost",
    };
    try {
      const body = email.body as string || "";

      const smtpClient = new SMTPClient(config);
      smtpClient.onError = (code, message) => {
        console.error(`SMTP Error: ${code} ${message}`);
        throw new Error(`SMTP Error: ${code} ${message}`);
      };
      smtpClient.onStateChange = (state, message) => {
        easyLog.warning(message, `SMTP State: ${state}`, {
          compact: true,
        });
      };
      await smtpClient.sendEmail({
        body,
        header: {
          from: {
            email: email.senderEmail as string,
            name: email.senderName as string,
          },
          to: {
            email: email.recipientEmail as string,
            name: email.recipientName as string,
          },
          subject: email.subject as string,
          contentType: email.contentType as "html" | "text",
          date: new Date(),
        },
      });
      // Send the email
      email.status = "sent";
      await email.save();
    } catch (e) {
      easyLog.error(e, "Failed to send email");
      email.status = "failed";
      await email.save();
    }
  },
});
