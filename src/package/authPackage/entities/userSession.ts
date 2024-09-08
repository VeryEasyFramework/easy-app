import { EasyEntity } from "@vef/easy-orm";
import { generateRandomString } from "@vef/string-utils";

export const userSessionEntity = new EasyEntity("userSession", {
  label: "User Session",
  description: "An authenticated user session",
});
userSessionEntity.addFields([
  {
    key: "user",
    label: "User",
    fieldType: "ConnectionField",
    connectionEntity: "user",
  },
  {
    key: "sessionId",
    label: "Session ID",
    fieldType: "DataField",
    readOnly: true,
  },
]);

userSessionEntity.addHook("beforeInsert", {
  label: "Generate Session ID",
  description: "Generate a random session ID",
  action(entity) {
    entity.sessionId = generateRandomString(32);
  },
});
