import { SMTPClient } from "#/package/emailPack/smtp/smtpClient.ts";
import type { SMTPOptions } from "#/package/emailPack/smtp/smtpTypes.ts";
import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import type { EmailAccount } from "#/package/emailPack/entryTypes/emailAccountInterface.ts";
import { raiseEasyException } from "#/easyException.ts";
import { dateUtils } from "#orm/utils/dateUtils.ts";
import type { Email } from "#/generatedTypes/emailInterface.ts";
import { easyLog } from "#/log/logging.ts";

export const emailEntry = new EntryType<Email>("email");

emailEntry.setConfig({
  label: "Email",
  description: "An email",
});
emailEntry.addFieldGroups([{
  key: "attachment",
  title: "Attachment",
  description: "Attachment details",
}]);
emailEntry.addFields([{
  key: "emailAccount",
  fieldType: "ConnectionField",
  connectionEntryType: "emailAccount",
  label: "Email Account",
  required: true,
  inList: true,
}, {
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
  key: "recipientEmails",
  fieldType: "ListField",
  label: "Recipient's Emails",
  description: "A list of email addresses of the recipients",
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
  key: "sendDate",
  fieldType: "TimeStampField",
  label: "Send Date",
  description: "The date the email was sent",
  readOnly: true,
  inList: true,
}, {
  key: "body",
  fieldType: "TextField",
  label: "Body",
  description: "The body of the email",
}, {
  key: "linkEntry",
  fieldType: "DataField",
  label: "Link Entry",
}, {
  key: "linkId",
  fieldType: "DataField",
  label: "Link Id",
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

emailEntry.addFields([{
  key: "hasAttachment",
  fieldType: "BooleanField",
  label: "Has Attachment",
  description: "Whether the email has an attachment",
  group: "attachment",
}, {
  key: "attachmentFileName",
  fieldType: "TextField",
  label: "File Name",
  description: "The name of the file",
  required: true,
  dependsOn: "hasAttachment",
  group: "attachment",
}, {
  key: "attachmentContent",
  fieldType: "TextField",
  label: "Content",
  description: "The content of the file",
  required: true,
  dependsOn: "hasAttachment",
  group: "attachment",
}, {
  key: "attachmentsContentType",
  fieldType: "ChoicesField",
  label: "Content Type",
  description: "The content type of the file",
  dependsOn: "hasAttachment",
  group: "attachment",
  required: true,
  choices: [{
    key: "text",
    label: "Text",
  }, {
    key: "csv",
    label: "CSV",
  }, {
    key: "pdf",
    label: "PDF",
  }],
}]);

emailEntry.addAction("send", {
  description: "Send the email",
  label: "Send",
  async action(email) {
    if (email.status !== "pending") {
      email.status = "pending";
      // raiseEasyException("Email has already been sent", 400);
      await email.save();
    }
    const { orm } = email;
    const emailAccount = await orm.getEntry<EmailAccount>(
      "emailAccount",
      email.emailAccount,
    );

    let password: string = emailAccount.smtpPassword || "";
    if (emailAccount.useGmailOauth) {
      const expireTime = emailAccount.expireTime as number;
      const nowTime = dateUtils.nowTimestamp();

      if (nowTime > expireTime) {
        await emailAccount.runAction("refreshToken");
      }
      const user = emailAccount.smtpUser;
      if (!user) {
        raiseEasyException("SMTP user is missing", 400);
      }
      if (!emailAccount.accessToken) {
        raiseEasyException("Access token is missing", 400);
      }
      password = emailAccount.accessToken as string;
    }
    const settings = await email.orm.getSettings("emailSettings");
    email.senderEmail = settings.emailAccount as string;
    const config: SMTPOptions = {
      port: settings.smtpPort as number || 587,
      smtpServer: emailAccount.smtpHost as string,
      userLogin: emailAccount.smtpUser as string,
      password,
      authMethod: emailAccount.useGmailOauth ? "XOAUTH2" : "LOGIN",
      domain: "localhost",
    };
    try {
      const body = email.body as string || "";

      const smtpClient = new SMTPClient(config);

      const errors: string[] = [];

      const addError = (message: string) => {
        errors.push(message);
        easyLog.error(message);
      };
      smtpClient.onError = (code, message) => {
        addError(`Email Error ${code}: ${message}`);
      };
      smtpClient.onStateChange = (state, message) => {
      };
      const sendDate = new Date();
      const attachments = [];
      if (email.hasAttachment) {
        if (
          email.attachmentContent && email.attachmentFileName &&
          email.attachmentsContentType
        ) {
          attachments.push({
            fileName: email.attachmentFileName,
            content: email.attachmentContent,
            contentType: email.attachmentsContentType,
          });
        }
      }

      const result = await smtpClient.sendEmail({
        body,
        header: {
          from: {
            email: emailAccount.emailAccount as string,
            name: emailAccount.senderName as string,
          },
          to: email.recipientEmails,
          subject: email.subject as string,
          contentType: email.contentType as "html" | "text",
          date: sendDate,
        },
        attachments,
      });
      if (errors.length > 0) {
        email.status = "failed";
        await email.save();
        easyLog.error(errors.join("\n"));
        return;
      }

      email.sendDate = sendDate.getTime();
      // Send the email
      email.status = "sent";
      await email.save();
    } catch (_e) {
      email.status = "failed";
      await email.save();
    }
  },
});
