import { defineEntity } from "@vef/easy-orm";

export const user = defineEntity("user", {
  fields: [
    {
      key: "First Name",
      label: "First Name",
      fieldType: "DataField",
    },
  ],
  label: "User",
});
