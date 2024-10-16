type OrmExceptionType =
  | "EntityNotFound"
  | "RequiredFieldMissing"
  | "InvalidField"
  | "InvalidFieldType"
  | "InvalidConnection"
  | "EntityAlreadyExists"
  | "PrimaryKeyAlreadySet"
  | "InvalidValue"
  | "InvalidChoices"
  | "InvalidMultiChoices"
  | "InvalidQuery"
  | "InvalidFilter"
  | "InvalidSort"
  | "InvalidLimit"
  | "InvalidOffset"
  | "InvalidPage"
  | "InvalidId"
  | "NotImplemented"
  | "InvalidFieldGroup"
  | "InvalidOperation"
  | "InvalidAction"
  | "MissingActionParam"
  | "DatabaseError"
  | "InvalidChild";

export class OrmException extends Error {
  type: OrmExceptionType;
  constructor(type: OrmExceptionType, message: string) {
    super(message);
    this.name = "OrmException";
    this.type = type;
  }
}

export function raiseOrmException(
  type: OrmExceptionType,
  message: string,
): never {
  throw new OrmException(type, message);
}
