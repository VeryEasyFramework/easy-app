import { defineEntity } from "@vef/easy-orm";

export const userEntity = defineEntity("user", {
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
  label: "User",
  hooks: {
    async beforeSave() {
      this.fullName = `${this.firstName} ${this.lastName}`;
    },
  },
});
