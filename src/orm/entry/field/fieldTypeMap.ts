import type { EasyFieldType } from "@vef/types";

export const fieldTypeMap: Record<EasyFieldType, string> = {
  IDField: "string",
  DataField: "string",
  IntField: "number",
  BigIntField: "bigint",
  DecimalField: "number",
  DateField: "Date",
  TimeStampField: "number",
  BooleanField: "boolean",
  PasswordField: "string",
  ChoicesField: "string | number",
  MultiChoiceField: "string[]",
  TextField: "string",
  EmailField: "string",
  ImageField: "string",
  JSONField: "Record<string, any>",
  PhoneField: "string",
  ConnectionField: "string",
  RichTextField: "Record<string, any>",
  URLField: "string",
  ListField: "string[]",
};
