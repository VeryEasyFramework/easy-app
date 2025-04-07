import type { EasyField, EntryType as EntryTypeDef } from "#/vef-types/mod.ts";
import type { EasyOrm } from "#orm/orm.ts";
import { raiseOrmException } from "#orm/ormException.ts";

export function validateEntryType(
  orm: EasyOrm,
  entryType: EntryTypeDef,
) {
  validateConnectionFields(orm, entryType);
  validateFetchFields(orm, entryType);
}

function validateConnectionFields(orm: EasyOrm, entryType: EntryTypeDef) {
  const fields = entryType.fields.filter((field) =>
    field.fieldType === "ConnectionField"
  );
  for (const field of fields) {
    if (!field.connectionEntryType) {
      raiseOrmException(
        "InvalidConnection",
        `Connection field ${field
          .key as string} in ${entryType.entryType} is missing connectionEntryType `,
      );
    }
    if (!orm.hasEntryType(field.connectionEntryType)) {
      raiseOrmException(
        "InvalidConnection",
        `Connection entry ${field.connectionEntryType} in ${entryType.entryType} does not exist`,
      );
    }
  }
}

function validateFetchFields(orm: EasyOrm, entryType: EntryTypeDef) {
  const fields = entryType.fields.filter((field) => field.fetchOptions);
  for (const field of fields) {
    const fetchOptions = field.fetchOptions!;
    if (!orm.hasEntryType(fetchOptions.fetchEntryType)) {
      raiseOrmException(
        "InvalidConnection",
        `Connection entry ${fetchOptions.fetchEntryType} does not exist`,
      );
    }
    const connectionEntryType = orm.getEntryType(
      fetchOptions.fetchEntryType,
    );

    const connectedField = connectionEntryType.fields.filter((f) => {
      return f.key === fetchOptions.thatFieldKey;
    });

    if (!connectedField) {
      raiseOrmException(
        "InvalidField",
        `Connection field ${fetchOptions.thatFieldKey} does not exist on entry type ${fetchOptions.fetchEntryType}`,
      );
    }
    orm.registry.registerFetchField({
      source: {
        entryType: entryType.entryType,
        field: fetchOptions.thisFieldKey,
      },
      target: {
        entryType: fetchOptions.fetchEntryType,
        idKey: fetchOptions.thisIdKey,
        field: fetchOptions.thatFieldKey,
      },
    });
  }
}
