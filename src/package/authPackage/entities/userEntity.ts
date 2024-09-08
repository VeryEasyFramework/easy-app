import { EasyEntity } from "@vef/easy-orm";
import { toTitleCase } from "@vef/string-utils";

export const userEntity = new EasyEntity("user", {
   label: "User",
   description: "A user of the system",
});

userEntity.addFields([
   {
      key: "firstName",
      label: "First Name",
      fieldType: "DataField",
      description: "The user's first name",
      required: true,
      group: "personal",
   },
   {
      key: "lastName",
      label: "Last Name",
      description: "The user's last name",
      fieldType: "DataField",
      group: "personal",
      required: true,
   },
   {
      key: "fullName",
      label: "Full Name",
      fieldType: "DataField",
      description:
         "The user's full name. This field is automatically generated from the first and last name fields.",
      readOnly: true,
      group: "personal",
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
   orderField: "fullName",
   orderDirection: "asc",
});

userEntity.addFieldGroup({
   key: "personal",
   title: "Personal Information",
   description: "The user's personal information",
});

userEntity.addHook("beforeSave", {
   label: "Format Name",
   description:
      "Format first and last name to title case and generate the full name from the first and last name fields",
   action(entity) {
      if (entity.firstName) {
         entity.firstName = toTitleCase(entity.firstName as string);
      }
      if (entity.lastName) {
         entity.lastName = toTitleCase(entity.lastName as string);
      }
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
