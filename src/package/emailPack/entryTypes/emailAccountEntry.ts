import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { EmailAccount } from "#/package/emailPack/entryTypes/emailAccountInterface.ts";
import { raiseEasyException, raiseRedirect } from "#/easyException.ts";
import { refreshAccessToken } from "#/package/googlePack/googleSettings.ts";
import { dateUtils } from "../../../../mod.ts";

export const emailAccountEntry = new EntryType<EmailAccount>("emailAccount");

emailAccountEntry.setConfig({
  description: "An email account that can be used to send and receive emails",
  label: "Email Account",
  titleField: "emailAccount",
});

emailAccountEntry.addFieldGroups([
  {
    key: "info",
    title: "General Information",
  },
  {
    key: "sending",
    title: "Sending",
  },
  {
    key: "oauth",
    title: "OAuth",
    dependsOn: "useGmailOauth",
  },
]);

emailAccountEntry.addFields([
  {
    key: "emailAccount",
    fieldType: "EmailField",
    label: "Email Account",
    description: "The email account to send emails from",
    group: "info",
    inList: true,
    required: true,
  },
  {
    key: "senderName",
    fieldType: "DataField",
    label: "Sender's Name",
    description: "The name to use when sending emails",
    group: "info",
  },
  {
    key: "useGmailOauth",
    fieldType: "BooleanField",
    label: "Use Gmail OAuth",
    description: "Use OAuth to authenticate with Gmail",
    group: "info",
    inList: true,
  },
  {
    key: "sendEmails",
    fieldType: "BooleanField",
    label: "Send Emails",
    description: "Whether this email account can send emails",
    group: "info",
    inList: true,
  },
  {
    key: "receiveEmails",
    fieldType: "BooleanField",
    label: "Receive Emails",
    description: "Whether this email account can receive emails",
    group: "info",
    inList: true,
  },
]);

emailAccountEntry.addFields([
  {
    key: "smtpHost",
    fieldType: "TextField",
    label: "SMTP Host",
    description: "The host of the SMTP server",
    group: "sending",
  },
  {
    key: "smtpPort",
    fieldType: "IntField",
    label: "SMTP Port",
    description: "The port of the SMTP server",
    group: "sending",
  },
  {
    key: "smtpUser",
    fieldType: "DataField",
    label: "SMTP User",
    description: "The user to authenticate with the SMTP server",
    group: "sending",
  },

  {
    key: "smtpPassword",
    fieldType: "PasswordField",
    label: "SMTP Password",
    description: "The password to authenticate with the SMTP server",
    dependsOn: {
      field: "useGmailOauth",
      value: false,
    },
    group: "sending",
  },
]);

emailAccountEntry.addFields([
  {
    key: "authStatus",
    label: "Auth Status",
    fieldType: "ChoicesField",
    defaultValue: "unauthorized",
    readOnly: true,
    group: "oauth",
    choices: [
      {
        key: "unauthorized",
        label: "Unauthorized",
        color: "error",
      },
      {
        key: "authorized",
        label: "Authorized",
        color: "success",
      },
    ],
  },
  {
    key: "accessToken",
    label: "Access Token",
    fieldType: "TextField",
    hidden: true,
    readOnly: true,
    group: "oauth",
  },
  {
    key: "expireTime",
    label: "Expire Time",
    fieldType: "TimeStampField",
    showTime: true,
    readOnly: true,
    group: "oauth",
  },
  {
    key: "acquiredTime",
    label: "Acquired Time",
    fieldType: "TimeStampField",
    showTime: true,
    readOnly: true,
    group: "oauth",
  },
  {
    key: "refreshToken",
    label: "Refresh Token",
    fieldType: "TextField",
    hidden: true,
    readOnly: true,
    group: "oauth",
  },
  {
    key: "tokenType",
    label: "Token Type",
    fieldType: "DataField",
    hidden: false,
    readOnly: true,
    group: "oauth",
  },
]);

emailAccountEntry.addAction("authorizeGmail", {
  label: "Authorize Gmail",
  description: "Authorize this email account to send emails using Gmail",
  async action(emailAccount, params) {
    const { orm } = emailAccount;
    const oauthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    const emailSettings = await orm.getSettings("emailSettings");
    const redirectHost = emailSettings.redirectHost;
    const clientId = emailSettings.clientId;
    const url = new URL(oauthEndpoint);
    url.searchParams.append("client_id", clientId);
    url.searchParams.append(
      "redirect_uri",
      `${redirectHost}/api?group=email&action=redirect`,
    );
    url.searchParams.append("response_type", "code");
    url.searchParams.append("include_granted_scopes", "true");
    url.searchParams.append("scope", "https://mail.google.com/");
    url.searchParams.append("access_type", "offline");
    url.searchParams.append("prompt", "consent");
    url.searchParams.append("state", emailAccount.id);
    return {
      redirect: url.toString(),
    };
  },
});

emailAccountEntry.addAction("refreshToken", {
  private: true,
  label: "Refresh Token",
  description: "Refresh the access token for this email account",
  async action(emailAccount) {
    const { orm } = emailAccount;
    const emailSettings = await orm.getSettings("emailSettings");

    const refreshToken = emailAccount.refreshToken;
    if (!refreshToken) {
      raiseEasyException("Refresh token is missing", 400);
    }
    const { access_token, expires_in, token_type, refresh_token, scope } =
      await refreshAccessToken({
        clientId: emailSettings.clientId,
        clientSecret: emailSettings.clientSecret,
        refreshToken,
      });
    const acquiredTime = dateUtils.nowTimestamp();
    emailAccount.accessToken = access_token;
    emailAccount.acquiredTime = acquiredTime;
    emailAccount.expireTime = acquiredTime + expires_in * 1000;
    emailAccount.tokenType = token_type;
    if (refresh_token) {
      emailAccount.refreshToken = refresh_token;
    }
    if (scope) {
      emailAccount.scope = scope;
    }

    emailAccount.authStatus = "authorized";

    await emailAccount.save();
  },
});
