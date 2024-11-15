import { SettingsType } from "#orm/entry/settings/settingsType.ts";

export const emailSettings = new SettingsType("emailSettings");

emailSettings.setConfig({
  label: "Email Settings",
  description: "Settings for sending emails",
});

emailSettings.addFieldGroup({
  key: "smtp",
  title: "SMTP Settings",
});

emailSettings.addFields([{
  key: "emailAccount",
  fieldType: "EmailField",
  label: "Email Account",
  description: "The email account to send emails from",
}, {
  key: "smtpHost",
  fieldType: "TextField",
  label: "SMTP Host",
  description: "The host of the SMTP server",
  required: true,
  group: "smtp",
}, {
  key: "smtpPort",
  fieldType: "IntField",
  label: "SMTP Port",
  description: "The port of the SMTP server",
  group: "smtp",
}, {
  key: "smtpUser",
  fieldType: "DataField",
  label: "SMTP User",
  description: "The user to authenticate with the SMTP server",
  group: "smtp",
}, {
  key: "smtpPassword",
  fieldType: "PasswordField",
  label: "SMTP Password",
  description: "The password to authenticate with the SMTP server",
}]);
