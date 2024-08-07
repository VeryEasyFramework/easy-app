import { defineEntity } from "@vef/easy-orm";

export const userEntity = defineEntity("user", {
  fields: [
    {
      key: "First Name",
      label: "First Name",
      fieldType: "DataField",
    },
    {
      key: "Last Name",
      label: "Last Name",
      fieldType: "DataField",
    },
    {
      key: "Email",
      label: "Email",
      fieldType: "DataField",
    },
    {
      key: "Password",
      label: "Password",
      fieldType: "DataField",
      readOnly: true,
    },
  ],
  label: "User",
});
