import type { EasyField } from "@vef/types";
import type { EntityDefinition, FieldGroup } from "@vef/types";
import { camelToSnakeCase, toPascalCase } from "@vef/string-utils";
import type { EasyOrm } from "#orm/orm.ts";
import type { EasyFieldType } from "#orm/entity/field/fieldTypes.ts";
import type { ChildListDefinition } from "#orm/entity/child/childEntity.ts";
import { buildFieldGroups } from "#orm/entity/field/buildFieldGroups.ts";
import type { EasyEntity } from "#orm/entity/entity/entityDefinition/easyEntity.ts";

export function buildEasyEntity(
  orm: EasyOrm,
  easyEntity: EasyEntity,
): EntityDefinition {
  buildConnectionFields(orm, easyEntity);
  buildChildEntities(orm, easyEntity);
  const groups: FieldGroup[] = buildFieldGroups(easyEntity);
  const listFields = buildListFields(easyEntity);

  return {
    entityId: easyEntity.entityId,
    fields: easyEntity.fields,
    fieldGroups: groups,
    children: easyEntity.children,
    listFields: listFields,
    config: easyEntity.config,
    hooks: easyEntity.hooks,
    actions: easyEntity.actions,
  };
}

function buildConnectionFields(orm: EasyOrm, easyEntity: EasyEntity) {
  const fields = easyEntity.fields.filter((field) =>
    field.fieldType === "ConnectionField"
  );

  for (const field of fields) {
    const titleField = buildConnectionTitleField(orm, field);
    if (!titleField) {
      continue;
    }

    field.connectionTitleField = titleField.key as string;
    field.connectionIdType = getConnectionIdType(orm, field.connectionEntity!);
    easyEntity.fields.push(titleField);
  }
}

function buildChildEntities(orm: EasyOrm, easyEntity: EasyEntity) {
  for (const child of easyEntity.children) {
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
    field.connectionIdType = getConnectionIdType(orm, field.connectionEntity!);
    child.fields.push(titleField);
  }
}
function getConnectionIdType(
  orm: EasyOrm,
  connectionEntity: string,
): EasyFieldType {
  const entity = orm.getEasyEntityDef(connectionEntity);
  switch (entity.config.idMethod.type) {
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
      const fieldKey = entity.config.idMethod.field;
      return entity.fields.find((field) => field.key === fieldKey)!.fieldType;
    }
  }
}

function buildConnectionTitleField(
  orm: EasyOrm,
  field: EasyField,
) {
  if (!field.connectionEntity) {
    return;
  }
  const entity = orm.getEasyEntityDef(field.connectionEntity);
  const titleFieldKey = entity.config.titleField;
  if (!titleFieldKey) {
    return;
  }

  const entityTitleField = entity.fields.find((field) =>
    field.key === titleFieldKey
  );
  if (!entityTitleField) {
    return;
  }
  const newKey = `${field.key as string}${
    toPascalCase(camelToSnakeCase(titleFieldKey))
  }`;

  const titleField = { ...entityTitleField };
  titleField.readOnly = true;
  titleField.inList = field.inList;
  titleField.group = field.group;
  titleField.fetchOptions = {
    fetchEntity: field.connectionEntity,
    thisIdKey: field.key,
    thisFieldKey: newKey,
    thatFieldKey: titleField.key,
  };
  titleField.key = newKey;

  return titleField;
}

function buildListFields(easyEntity: EasyEntity) {
  const listFields: Array<string> = [];

  if (easyEntity.config.titleField) {
    const titleField = easyEntity.fields.find((field) =>
      field.key === easyEntity.config.titleField
    );
    if (titleField) {
      titleField.inList = true;
    }
  }
  for (const field of easyEntity.fields) {
    if (field.inList) {
      listFields.push(field.key);
    }
  }
  listFields.push("createdAt");
  listFields.push("updatedAt");
  listFields.push("id");
  return listFields;
}
