import { EasyEntity } from "#orm/entity/entity/entityDefinition/easyEntity.ts";
import { toCamelCase } from "@vef/string-utils";

export const userRoleEntity = new EasyEntity("userRole");

userRoleEntity.setConfig({
  label: "User Role",
  description: "A role that can be assigned to a user",
  titleField: "roleName",
  editLog: true,
  idMethod: {
    type: "field",
    field: "roleKey",
  },
});

userRoleEntity.addFields([
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

userRoleEntity.addHook("beforeValidate", {
  label: "Generate Role Key",
  description: "Generate a unique role key before inserting the role",
  action(entity) {
    entity.roleKey = toCamelCase(entity.roleName as string);
  },
});
