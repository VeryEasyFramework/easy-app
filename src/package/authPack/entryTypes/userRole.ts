import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { toCamelCase } from "@vef/string-utils";

export const userRoleEntry = new EntryType("userRole");

userRoleEntry.setConfig({
  label: "User Role",
  description: "A role that can be assigned to a user",
  titleField: "roleName",
  editLog: true,
  idMethod: {
    type: "field",
    field: "roleKey",
  },
});

userRoleEntry.addFields([
  {
    key: "roleName",
    label: "Role Name",
    fieldType: "DataField",
    description: "The name of the role",
    required: true,
  },
  {
    key: "roleKey",
    label: "Role Key",
    fieldType: "DataField",
    description: "A unique key for the role",
    readOnly: true,
  },
  {
    key: "description",
    label: "Description",
    fieldType: "DataField",
    description: "A description of the role",
  },
]);

userRoleEntry.addChild({
  childName: "entryTypePermission",
  label: "Entry Type Permission",
  fields: [{
    key: "entryType",
    label: "Entry Type",
    fieldType: "DataField",
  }],
});

userRoleEntry.addHook("beforeValidate", {
  label: "Generate Role Key",
  description: "Generate a unique role key before inserting the role",
  action(userRole) {
    userRole.roleKey = toCamelCase(userRole.roleName as string);
  },
});
