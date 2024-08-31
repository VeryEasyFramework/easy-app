import { defineEntity } from "@vef/easy-orm";
import { toTitleCase } from "@vef/string-utils";

export const userEntity = defineEntity("user", {
  label: "User",
  titleField: "fullName",
  description:
    "This entity represents a user of the app, and is responsible for managing user data and authentication.",
  fields: [
    {
      key: "firstName",
      label: "First Name",
      fieldType: "DataField",
      description: "The user's first name",
      required: true,
    },
    {
      key: "lastName",
      label: "Last Name",
      description: "The user's last name",
      fieldType: "DataField",
      required: true,
    },
    {
      key: "fullName",
      label: "Full Name",
      fieldType: "DataField",
      description:
        "The user's full name. This field is automatically generated from the first and last name fields.",
      readOnly: true,
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
      fieldType: "DataField",
      readOnly: true,
    },
  ],
  hooks: {
    async beforeSave() {
      this.firstName = toTitleCase(this.firstName.trim());
      this.lastName = toTitleCase(this.lastName.trim());
      this.fullName = `${this.firstName} ${this.lastName}`;
    },
  },
  actions: [
    {
      key: "setPassword",
      label: "Set Password",
      description: "Set the user's password",
      async action(password: string) {
        return "password set";
      },
    },
    {
      key: "test",
      label: "test action",
      description: "test action",
      async action() {
        return "test action result";
      },
    },
  ],
});
