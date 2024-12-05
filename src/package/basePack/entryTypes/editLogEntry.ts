import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";

export const editLogEntry = new EntryType("editLog");

editLogEntry.setConfig({
  label: "Edit Log",
  description: "Log of all edits made to the system",
  orderField: "createdAt",
  orderDirection: "desc",
});

editLogEntry.addFields([
  {
    key: "entryType",
    fieldType: "DataField",
    label: "Entry Type",
    description: "The entry type that was edited",
    inList: true,
    readOnly: true,
  },
  {
    key: "entryId",
    fieldType: "DataField",
    label: "Entry ID",
    description: "The ID of the entry that was edited",
    inList: true,
  },
  {
    key: "entryTitle",
    fieldType: "DataField",
    label: "Entry Title",
    inList: true,
  },
  {
    key: "action",
    fieldType: "ChoicesField",
    label: "Action",
    description: "The action that was performed",
    choices: [
      { key: "create", label: "Created" },
      { key: "update", label: "Updated" },
      { key: "delete", label: "Deleted" },
    ],
    inList: true,
  },
  {
    key: "editData",
    fieldType: "JSONField",
    label: "Edit Data",
    description: "The data that was changed",
  },
  {
    key: "user",
    fieldType: "ConnectionField",
    label: "User",
    inList: true,
    description: "The user who made the edit",
    connectionEntryType: "user",
  },
]);
