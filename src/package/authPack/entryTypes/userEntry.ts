import { toTitleCase } from "@vef/string-utils";
import { generateSalt, hashPassword } from "#/package/authPack/security.ts";
import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";

export const userEntry = new EntryType("user");

userEntry.setConfig({
  label: "User",
  description: "A user of the system",
  titleField: "fullName",
  orderField: "fullName",
  orderDirection: "asc",
  editLog: true,
});

userEntry.addFields([
  {
    key: "firstName",
    label: "First Name",
    fieldType: "DataField",
    description: "The user's first name",
    required: true,
    group: "personal",
  },
  {
    key: "lastName",
    label: "Last Name",
    description: "The user's last name",
    fieldType: "DataField",
    group: "personal",
    required: true,
  },
  {
    key: "fullName",
    label: "Full Name",
    fieldType: "DataField",
    description:
      "The user's full name. This field is automatically generated from the first and last name fields.",
    readOnly: true,
    group: "personal",
  },
  {
    key: "email",
    label: "Email",
    fieldType: "DataField",
    description: "The user's email address",
    required: true,
    inList: true,
  },
  {
    key: "password",
    label: "Password",
    fieldType: "PasswordField",
    description: "The hashed password of the user",
    readOnly: true,
    hidden: true,
  },
  {
    key: "resetPasswordToken",
    label: "Reset Password Token",
    fieldType: "PasswordField",
    description: "The token used to reset the user's password",
    readOnly: true,
    hidden: true,
  },
  {
    key: "systemAdmin",
    label: "System Administrator",
    fieldType: "BooleanField",
    readOnly: true,
    inList: true,
    description:
      "Is the user a system administrator? (admin users have access to all parts of the system)",
  },
  {
    key: "apiToken",
    label: "API Token",
    fieldType: "PasswordField",
    description: "The user's API token",
    readOnly: true,
  },
]);

userEntry.addFieldGroup({
  key: "personal",
  title: "Personal Information",
  description: "The user's personal information",
});

userEntry.addHook("beforeSave", {
  label: "Format Name",
  description:
    "Format first and last name to title case and generate the full name from the first and last name fields",
  action(user) {
    if (user.firstName) {
      user.firstName = toTitleCase(user.firstName as string);
    }
    if (user.lastName) {
      user.lastName = toTitleCase(user.lastName as string);
    }
    user.fullName = `${user.firstName} ${user.lastName}`;
  },
});

userEntry.addAction("setPassword", {
  label: "Set Password",
  description: "Set the user's password",
  async action(user, params) {
    const password = params?.password as string;
    const salt = generateSalt();
    const hashed = await hashPassword(password, salt);
    user.password = `${salt}:${hashed}`;
    user.resetPasswordToken = null;
    await user.save();
  },
  params: [{
    key: "password",
    fieldType: "PasswordField",
    required: true,
  }],
});

userEntry.addAction("validatePassword", {
  label: "Validate Password",
  description: "Validate the user's password",
  private: true,
  async action(user, params) {
    const password = params?.password as string;
    const existingPassword = user.password as string | null || "";

    const [salt, hashed] = existingPassword.split(":");
    const testHash = await hashPassword(password, salt);
    return hashed === testHash;
  },
  params: [{
    key: "password",
    fieldType: "PasswordField",
    required: true,
  }],
});

userEntry.addAction("generateResetToken", {
  label: "Generate Reset Token",
  private: true,
  description: "Generate a reset token for the user",
  async action(user) {
    const token = generateSalt();
    user.resetPasswordToken = token;
    await user.save();
    return { token };
  },
});

userEntry.addAction("generateApiToken", {
  label: "Generate API Token",
  description: "Generate an API token for the user",
  async action(user) {
    const token = generateSalt();
    user.apiToken = token;

    await user.save();
    return { token };
  },
});

userEntry.setPermission({
  role: "basicUser",
  read: true,
  write: false,
  create: false,
  delete: false,
});
