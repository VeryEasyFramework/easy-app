import { EasyEntity } from "@vef/easy-orm";
import { raiseOrmException } from "../../../../../easy-orm/src/ormException.ts";

export const userEntity = new EasyEntity("user");

userEntity.addFields([
  {
    key: "firstName",
    label: "First Name",
    fieldType: "DataField",
    description: "The user's first name",
    required: true,
  },
  {
    key: "lastName",
    label: "Last Name",
    description: "The user's last name",
    fieldType: "DataField",
    required: true,
  },
  {
    key: "fullName",
    label: "Full Name",
    fieldType: "DataField",
    description:
      "The user's full name. This field is automatically generated from the first and last name fields.",
    readOnly: true,
  },
  {
    key: "email",
    label: "Email",
    fieldType: "DataField",
    description: "The user's email address",
    required: true,
    inList: true,
  },
  {
    key: "password",
    label: "Password",
    fieldType: "DataField",
    readOnly: true,
    hidden: true,
  },
]);

userEntity.setConfig({
  titleField: "fullName",
});

userEntity.addHook("beforeSave", {
  label: "Generate Full Name",
  description: "Generate the full name from the first and last name fields",
  action(entity) {
    entity.fullName = `${entity.firstName} ${entity.lastName}`;
  },
});

userEntity.addAction("resetPassword", {
  label: "Reset Password",
  description: "Reset the user's password",
  action(entity) {
    return `Password reset for ${entity.fullName}`;
  },
});
