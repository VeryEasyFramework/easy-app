import { EntryType } from "../../../orm/entry/entry/entryType/entryType.ts";

export const userSessionEntity = new EntryType("userSession", {
  label: "User Session",
  description: "An authenticated user session",
});

userSessionEntity.setConfig({
  label: "User Session",
  description: "An authenticated user session",
  titleField: "userFullName",
});

userSessionEntity.addFields([
  {
    key: "user",
    label: "User",
    fieldType: "ConnectionField",
    connectionEntity: "user",
    readOnly: true,
  },
  {
    key: "sessionData",
    label: "Session Data",
    fieldType: "JSONField",
    readOnly: true,
  },
]);

userSessionEntity.addHook("beforeInsert", {
  label: "Add sessionId",
  description: "Add sessionId to the sessionData",
  action(entity) {
    entity.sessionData = {
      ...entity.sessionData as Record<string, any>,
      sessionId: entity.id,
    };
  },
});

export interface SessionData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  sessionId: string;
}
