import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";

export const userSessionEntry = new EntryType("userSession", {
  label: "User Session",
  description: "An authenticated user session",
});

userSessionEntry.setConfig({
  label: "User Session",
  description: "An authenticated user session",
  titleField: "userFullName",
});

userSessionEntry.addFields([
  {
    key: "user",
    label: "User",
    fieldType: "ConnectionField",
    connectionEntryType: "user",
    readOnly: true,
  },
  {
    key: "sessionData",
    label: "Session Data",
    fieldType: "JSONField",
    readOnly: true,
  },
]);

userSessionEntry.addHook("beforeInsert", {
  label: "Add sessionId",
  description: "Add sessionId to the sessionData",
  action(userSession) {
    userSession.sessionData = {
      ...(userSession.sessionData as Record<string, any>),
      sessionId: userSession.id,
    };
  },
});

export interface SessionData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  sessionId: string;
  systemAdmin: boolean;
}
