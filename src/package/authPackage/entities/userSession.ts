import { defineEntity } from "@vef/easy-orm";
import { generateRandomString } from "jsr:@vef/string-utils@^0.1.3";

const userSessionEntity = defineEntity("userSession", {
  fields: [
    {
      key: "user",
      label: "User",
      fieldType: "ConnectionField",
      linkedEntity: "user",
    },
    {
      key: "sessionId",
      label: "Session ID",
      fieldType: "DataField",
      readOnly: true,
    },
  ],
  label: "User Session",
  hooks: {
    beforeInsert() {
      this.sessionId = generateRandomString(32);
    },
  },
});
