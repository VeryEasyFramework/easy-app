import { EasyEntity } from "@vef/easy-orm";

export const editLogEntity = new EasyEntity("editLog");

editLogEntity.setConfig({
   label: "Edit Log",
   description: "Log of all edits made to the system",
   orderField: "createdAt",
   orderDirection: "desc",
});

editLogEntity.addFields([
   {
      key: "entity",
      fieldType: "DataField",
      label: "Entity",
      description: "The entity that was edited",
      inList: true,
      readOnly: true,
   },
   {
      key: "entityId",
      fieldType: "DataField",
      label: "Entity ID",
      description: "The ID of the entity that was edited",
      inList: true,
   },
   {
      key: "entityTitle",
      fieldType: "DataField",
      label: "Entity Title",
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
      description: "The user who made the edit",
      connectionEntity: "user",
   },
]);
