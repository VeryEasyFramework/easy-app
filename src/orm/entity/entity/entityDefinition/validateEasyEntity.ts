import type { EntityDefinition } from "@vef/types";
import type { EasyOrm } from "#orm/orm.ts";
import { raiseOrmException } from "#orm/ormException.ts";

export function validateEntityDefinition(
  orm: EasyOrm,
  entityDefinition: EntityDefinition,
) {
  validateConnectionFields(orm, entityDefinition);
  validateFetchFields(orm, entityDefinition);
}

function validateConnectionFields(orm: EasyOrm, entity: EntityDefinition) {
  const fields = entity.fields.filter((field) =>
    field.fieldType === "ConnectionField"
  );
  for (const field of fields) {
    if (!field.connectionEntity) {
      raiseOrmException(
        "InvalidConnection",
        `Connection field ${field
          .key as string} in ${entity.entityId} is missing connectionEntity `,
      );
    }
    if (!orm.hasEntity(field.connectionEntity)) {
      raiseOrmException(
        "InvalidConnection",
        `Connection entity ${field.connectionEntity} in ${entity.entityId} does not exist`,
      );
    }
  }
}

function validateFetchFields(orm: EasyOrm, entity: EntityDefinition) {
  const fields = entity.fields.filter((field) => field.fetchOptions);
  for (const field of fields) {
    const fetchOptions = field.fetchOptions!;
    if (!orm.hasEntity(fetchOptions.fetchEntity)) {
      raiseOrmException(
        "InvalidConnection",
        `Connection entity ${fetchOptions.fetchEntity} does not exist`,
      );
    }
    const connectionEntity = orm.getEntityDef(
      fetchOptions.fetchEntity,
    );

    const connectedField = connectionEntity.fields.filter((f) => {
      return f.key === fetchOptions.thatFieldKey;
    });

    if (!connectedField) {
      raiseOrmException(
        "InvalidField",
        `Connection field ${fetchOptions.thatFieldKey} does not exist on entity ${fetchOptions.fetchEntity}`,
      );
    }
    orm.registry.registerFetchField({
      source: {
        entity: entity.entityId,
        field: fetchOptions.thisFieldKey,
      },
      target: {
        entity: fetchOptions.fetchEntity,
        idKey: fetchOptions.thisIdKey,
        field: fetchOptions.thatFieldKey,
      },
    });
  }
}
