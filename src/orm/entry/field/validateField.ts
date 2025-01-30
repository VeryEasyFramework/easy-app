import { raiseOrmException } from "#orm/ormException.ts";
import type { EasyField, EasyFieldType } from "@vef/types";
import type { EasyOrm } from "#orm/orm.ts";

export function validateBoolean(field: EasyField, value: any): boolean {
  let hasError = false;
  if (value === null || value === undefined) {
    return false;
  }
  switch (typeof value) {
    case "boolean":
      break;
    case "string":
      if (value === "true" || value === "false") {
        value = value === "true";
        break;
      }
      if (value === "1" || value === "0") {
        value = value === "1";
        break;
      }
      hasError = true;
      break;
    case "number":
      if (value === 0 || value === 1) {
        value = value === 1;
        break;
      }
      hasError = true;
      break;
    default:
      hasError = true;
      break;
  }
  if (hasError) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for BooleanField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  return value;
}

export function validateDate(
  field: EasyField,
  value: string | Date,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    if (value === "") {
      return null;
    }
    value = new Date(value);
  }
  if (!(value instanceof Date)) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for DateField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  if (value.toDateString() === "Invalid Date") {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for DateField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  // convert to yyyy-mm-dd
  value = value.toISOString().split("T")[0];

  return value;
}

export function validateTimeStamp(
  field: EasyField,
  value: string | Date,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  value = new Date(value);
  if (!(value instanceof Date)) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for TimeStampField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  if (value.toDateString() === "Invalid Date") {
    return null;
  }
  return value.getTime();
}
export function validateInt(field: EasyField, value: any): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    value = parseInt(value);
  }

  if (isNaN(value)) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for IntField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  return value;
}

export function validateBigInt(field: EasyField, value: any): bigint | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    value = BigInt(value);
  }
  if (typeof value !== "bigint") {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for BigIntField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  return value;
}

export function validateDecimal(field: EasyField, value: any): number {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  if (isNaN(value)) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for DecimalField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  return value;
}

export function validateCurrency(field: EasyField, value: any): number {
  return validateDecimal(field, value);
}

export function validateData(field: EasyField, value: any): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  switch (typeof value) {
    case "number":
      value = value.toString();
      break;
    case "string":
      break;

    default:
      value = "";
      raiseOrmException(
        "InvalidValue",
        `Invalid value for DataField ${
          field.label ? field.label : field.key as string
        }:P${field.label} ${value}. Must be a string of max length 255`,
      );
  }
  if (value.length > 255) {
    raiseOrmException(
      "InvalidValue",
      `Too many characters for DataField ${
        field.label ? field.label : field.key as string
      }: ${value}. Max length is 255`,
    );
  }

  return value;
}

export function validateEmail(field: EasyField, value: string): string | null {
  if (!value) {
    return null;
  }
  if (typeof value !== "string") {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for EmailField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for EmailField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  value = value.toLowerCase();
  return value;
}

export function validateRichText(field: EasyField, value: any): string | null {
  return validateJson(field, value);
}

export function validateURL(field: EasyField, value: any): string | null {
  if (!value) {
    return null;
  }
  if (typeof value !== "string") {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for URLField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  try {
    const url = new URL(value);
    return value;
  } catch (_e) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for URLField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
}
export function validateJson(field: EasyField, value: any): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  try {
    switch (typeof value) {
      case "string":
        JSON.parse(value);
        break;
      case "object":
        value = JSON.stringify(value);
        value = JSON.parse(value);
        break;
      default:
        raiseOrmException(
          "InvalidValue",
          `Invalid value for JSONField ${
            field.label ? field.label : field.key as string
          }: ${value}`,
        );
    }
  } catch (_e) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for JSONField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  return value;
}

export function validateTextField(field: EasyField, value: any): string {
  if (value === null || value === undefined) {
    return "";
  }
  switch (typeof value) {
    case "string":
      break;
    case "number":
      value = value.toString();
      break;
    default:
      raiseOrmException(
        "InvalidValue",
        `Invalid value for TextField ${
          field.label ? field.label : field.key as string
        }: ${value}`,
      );
  }

  return value;
}

export function validateChoices(field: EasyField, value: any): string | null {
  if (!value) {
    return null;
  }

  if (!field.choices) {
    raiseOrmException(
      "InvalidField",
      `ChoicesField ${
        field.label ? field.label : field.key as string
      } must have choices`,
    );
  }
  const choices = field.choices.map((choice) => {
    if (typeof choice.key === "number") {
      return choice.key.toString();
    }
    return choice.key;
  });
  let temValue = value;
  if (typeof value === "number") {
    temValue = value.toString();
  }
  if (!choices.includes(temValue)) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for ChoicesField ${
        field.label ? field.label : field.key as string
      }: ${value}. Must be one of ${choices.join(", ")}`,
    );
  }
  return value;
}

export function validateMultiChoices(field: EasyField, value: any): string[] {
  if (!Array.isArray(value)) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for MultiChoicesField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  if (!field.choices) {
    raiseOrmException(
      "InvalidField",
      `MultiChoicesField ${
        field.label ? field.label : field.key as string
      } must have choices`,
    );
  }

  const choices = field.choices.map((choice) => {
    return choice.key;
  });
  for (const val of value) {
    if (!choices.includes(val)) {
      raiseOrmException(
        "InvalidValue",
        `Invalid value for MultiChoicesField ${
          field.label ? field.label : field.key as string
        }: ${val}. Must be one of ${choices.join(", ")}`,
      );
    }
  }
  return value;
}

export function validatePassword(field: EasyField, value: any): string | null {
  if (!value) {
    return null;
  }
  if (typeof value !== "string") {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for PasswordField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  return value;
}

export function validatePhone(field: EasyField, value: any): string | null {
  if (!value) {
    return null;
  }
  if (typeof value !== "string") {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for PhoneField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  if (!value.match(/^\+?[0-9]+$/)) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for PhoneField ${
        field.label ? field.label : field.key as string
      }: ${value}`,
    );
  }
  return value;
}

export function validateList(field: EasyField, value: any) {
  if (!value) {
    return [];
  }
  if (!Array.isArray(value)) {
    raiseOrmException(
      "InvalidValue",
      `Invalid value for ListField ${
        field.label ? field.label : field.key as string
      }: ${value}. Must be an array of strings`,
    );
  }
  return value;
}

export function validateField(
  field: EasyField,
  value: any,
) {
  switch (field.fieldType as EasyFieldType) {
    case "BooleanField":
      value = validateBoolean(field, value);
      break;
    case "DateField":
      value = validateDate(field, value);
      break;
    case "IntField":
      value = validateInt(field, value);
      break;
    case "BigIntField":
      value = validateBigInt(field, value);
      break;
    case "DecimalField":
      value = validateDecimal(field, value);
      break;
    case "CurrencyField":
      value = validateCurrency(field, value);
      break;
    case "DataField":
      value = validateData(field, value);
      break;
    case "JSONField":
      value = validateJson(field, value);
      break;
    case "EmailField":
      value = validateEmail(field, value);
      break;
    case "ImageField":
      raiseOrmException("NotImplemented", "ImageField is not supported yet");
      break;
    case "TextField":
      value = validateTextField(field, value);
      break;
    case "ChoicesField":
      value = validateChoices(field, value);
      break;
    case "MultiChoiceField":
      value = validateMultiChoices(field, value);
      break;
    case "PasswordField":
      value = validatePassword(field, value);
      break;
    case "PhoneField":
      value = validatePhone(field, value);
      break;
    case "TimeStampField":
      value = validateTimeStamp(field, value);
      break;
    case "ConnectionField":
      break;
    case "RichTextField":
      value = validateJson(field, value);
      break;
    case "URLField":
      value = validateTextField(field, value);
      break;
    case "ListField":
      value = validateList(field, value);
      break;
    default:
      raiseOrmException(
        "NotImplemented",
        `Field type ${field.fieldType} is not implemented`,
      );
  }

  return value;
}

export async function validateConnection(
  field: EasyField,
  value: any,
  orm: EasyOrm,
) {
  if (!value) {
    return null;
  }
  if (field.fieldType !== "ConnectionField") {
    raiseOrmException(
      "InvalidFieldType",
      `Field ${field.key as string} is not a ConnectionField`,
    );
  }
  if (!field.connectionEntryType) {
    raiseOrmException(
      "InvalidField",
      `ConnectionField ${field.key as string} must have a connectionEntryType`,
    );
  }
  if (!await orm.exists(field.connectionEntryType, value)) {
    raiseOrmException(
      "EntryTypeNotFound",
      `Connection ${field.connectionEntryType} with id ${value} does not exist`,
    );
  }
  return value;
}
