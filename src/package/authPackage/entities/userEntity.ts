import { defineEntity } from "@vef/easy-orm";

export const userEntity = defineEntity("user", {
  label: "User",
  titleField: "fullName",
  fields: [
    {
      key: "firstName",
      label: "First Name",
      fieldType: "DataField",
      required: true,
      inList: true,
    },
    {
      key: "lastName",
      label: "Last Name",
      fieldType: "DataField",
    },
    {
      key: "fullName",
      label: "Full Name",
      fieldType: "DataField",
      readOnly: true,
    },
    {
      key: "email",
      label: "Email",
      fieldType: "DataField",
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
