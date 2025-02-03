import type {
  ChildListDefinition,
  EasyField,
  EasyFieldType,
  EntryType as EntryTypeDef,
  FieldGroup,
} from "@vef/types";
import { camelToSnakeCase, toPascalCase } from "@vef/string-utils";
import type { EasyOrm } from "#orm/orm.ts";
import { buildFieldGroups } from "#orm/entry/field/buildFieldGroups.ts";
import { raiseOrmException } from "#orm/ormException.ts";
import type { EntryType } from "#orm/entry/entry/entryType/entryType.ts";

export function buildEntryType(
  orm: EasyOrm,
  entryType: EntryType,
): EntryTypeDef {
  if (entryType.config.statusField) {
    entryType.statusField = entryType.config.statusField;
  }
  buildConnectionFields(orm, entryType);
  buildChildren(orm, entryType);
  const groups: FieldGroup[] = buildFieldGroups(entryType);
  const listFields = buildListFields(entryType);

  return {
    entryType: entryType.entryType,
    statusField: entryType.statusField,
    fields: entryType.fields,
    fieldGroups: groups,
    children: entryType.children,
    listFields: listFields,
    config: entryType.config as EntryTypeDef["config"],
    hooks: entryType.hooks,
    actions: entryType.actions,
    connections: [],
  };
}

function buildConnectionFields(orm: EasyOrm, entryType: EntryType) {
  const fields = entryType.fields.filter((field) =>
    field.fieldType === "ConnectionField"
  );

  for (const field of fields) {
    const titleField = buildConnectionTitleField(orm, field);
    if (!titleField) {
      continue;
    }

    field.connectionTitleField = titleField.key as string;
    field.connectionIdType = getConnectionIdType(
      orm,
      field.connectionEntryType!,
    );
    entryType.fields.push(titleField);
  }
}

function buildChildren(orm: EasyOrm, entryType: EntryType) {
  for (const child of entryType.children) {
    buildChild(orm, child);
  }
}

function buildChild(orm: EasyOrm, child: ChildListDefinition) {
  const connectionFields = child.fields.filter((field) =>
    field.fieldType === "ConnectionField"
  );
  for (const field of connectionFields) {
    const titleField = buildConnectionTitleField(orm, field);
    if (!titleField) {
      continue;
    }

    field.connectionTitleField = titleField.key as string;
    field.connectionIdType = getConnectionIdType(
      orm,
      field.connectionEntryType!,
    );
    child.fields.push(titleField);
  }
}
function getConnectionIdType(
  orm: EasyOrm,
  connectionEntry: string,
): EasyFieldType {
  const entryType = orm.getEntryTypeSource(connectionEntry);
  switch (entryType.config.idMethod.type) {
    case "hash":
      return "DataField";
    case "number":
      return "IntField";
    case "uuid":
      return "DataField";
    case "series":
      return "IntField";
    case "data":
      return "DataField";
    case "field": {
      const fieldKey = entryType.config.idMethod.field;
      return entryType.fields.find((field) => field.key === fieldKey)!
        .fieldType;
    }

    default:
      raiseOrmException(
        "InvalidFieldType",
        `Invalid id method type ${entryType.config.idMethod} for entry type ${entryType.entryType}`,
      );
  }
}

function buildConnectionTitleField(
  orm: EasyOrm,
  field: EasyField,
) {
  if (!field.connectionEntryType) {
    return;
  }
  const entryType = orm.getEntryTypeSource(field.connectionEntryType);
  const titleFieldKey = entryType.config.titleField;
  if (!titleFieldKey) {
    return;
  }

  const entryTitleField = entryType.fields.find((field) =>
    field.key === titleFieldKey
  );
  if (!entryTitleField) {
    return;
  }
  const newKey = `${field.key as string}${
    toPascalCase(camelToSnakeCase(titleFieldKey as string))
  }`;

  const titleField = { ...entryTitleField };
  titleField.readOnly = true;
  titleField.inList = field.inList;
  titleField.inConnectionList = field.inConnectionList;
  titleField.group = field.group;
  titleField.fetchOptions = {
    fetchEntryType: field.connectionEntryType,
    thisIdKey: field.key,
    thisFieldKey: newKey,
    thatFieldKey: titleField.key,
  };
  titleField.key = newKey;

  return titleField;
}

function buildListFields(entryType: EntryType) {
  const listFields: Array<string> = [];

  if (entryType.config.titleField) {
    const titleField = entryType.fields.find((field) =>
      field.key === entryType.config.titleField
    );
    if (titleField) {
      titleField.inList = true;
    }
  }
  for (const field of entryType.fields) {
    if (field.inList) {
      listFields.push(field.key);
      if (field.connectionTitleField) {
        listFields.push(field.connectionTitleField);
      }
    }
  }
  listFields.push("createdAt");
  listFields.push("updatedAt");
  listFields.push("id");
  return listFields;
}
