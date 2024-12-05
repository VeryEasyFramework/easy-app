import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { fieldTypeMap } from "#orm/entry/field/fieldTypeMap.ts";

export const entryTypeEntry = new EntryType("entryType");

entryTypeEntry.setConfig({
  label: "Entry Type",
  description: "A type of entry in the database.",
  editLog: false,
  titleField: "label",
  idMethod: {
    type: "field",
    field: "entryType",
  },
});

entryTypeEntry.addFields([
  {
    key: "entryType",
    label: "Entry Type",
    description:
      "The type of entry in camelCase. This is used as the ID for this Entry.",
    fieldType: "DataField",
    required: true,
  },
  {
    key: "label",
    label: "Label",
    description: "The human-readable label for this Entry.",
    fieldType: "DataField",
    required: true,
  },
  {
    key: "description",
    label: "Description",
    description: "A brief description of this Entry.",
    fieldType: "TextField",
  },
  {
    key: "titleField",
    label: "Title Field",
    description:
      "The field to use as the title for this Entry in the UI instead of the ID. If not provided, the Entry's ID will be used.",
    fieldType: "DataField",
  },
  {
    key: "statusField",
    label: "Status Field",
    description:
      "The field to use as the status for this Entry in the UI. This field should be a Choices field.",
    fieldType: "DataField",
  },
  {
    key: "tableName",
    label: "Table Name",
    description:
      "The name of the table in the database where this Entry is stored. This defaults to the camelCase version of the Entry's name.",
    fieldType: "DataField",
  },
  {
    key: "editLog",
    label: "Edit Log",
    description:
      "If true, this Entry has an edit log that tracks changes to records. This defaults to false.",
    fieldType: "BooleanField",
  },
  {
    key: "idMethod",
    label: "ID Method",
    description:
      "The method used to generate unique identifiers for this Entry. If not provided, the Entry will use the `HashMethod` with a hash length of 16.",
    fieldType: "ChoicesField",
    choices: [{
      key: "number",
      label: "Number",
    }, {
      key: "uuid",
      label: "UUID",
    }, {
      key: "hash",
      label: "Hash",
    }, {
      key: "data",
      label: "Data",
    }, {
      key: "series",
      label: "Series",
    }, {
      key: "field",
      label: "Field",
    }],
  },
  {
    key: "orderField",
    label: "Order Field",
    description:
      "The field to use for the order of records when fetching a list of records from the database.",
    fieldType: "DataField",
  },
  {
    key: "orderDirection",
    label: "Order Direction",
    description:
      "The direction to order records when fetching a list of records from the database. This defaults to 'asc'.",
    fieldType: "ChoicesField",
    choices: [{
      key: "asc",
      label: "Ascending",
    }, {
      key: "desc",
      label: "Descending",
    }],
  },
]);

entryTypeEntry.addChild({
  childName: "fields",
  label: "Fields",
  fields: [{
    key: "key",
    label: "Key",
    description: "The key for the field in camelCase.",
    fieldType: "DataField",
  }, {
    key: "label",
    label: "Label",
    description: "The human-readable label for the field.",
    fieldType: "DataField",
  }, {
    key: "description",
    label: "Description",
    description: "A brief description of the field.",
    fieldType: "TextField",
  }, {
    key: "fieldType",
    label: "Field Type",
    description: "The type of field.",
    fieldType: "ChoicesField",
    choices: Object.keys(fieldTypeMap).map((key) => ({
      key,
      label: key,
    })),
  }, {
    key: "required",
    label: "Required",
    description: "If true, this field is required.",
    fieldType: "BooleanField",
  }],
});

entryTypeEntry.addChild({
  childName: "actions",
  label: "Actions",
  fields: [{
    key: "key",
    label: "Key",
    description: "The key for the action in camelCase.",
    fieldType: "DataField",
  }, {
    key: "label",
    label: "Label",
    description: "The human-readable label for the action.",
    fieldType: "DataField",
  }, {
    key: "description",
    label: "Description",
    description: "A brief description of the action.",
    fieldType: "TextField",
  }, {
    key: "action",
    label: "Action",
    description: "The action to perform.",
    fieldType: "TextField",
  }, {
    key: "params",
    label: "Params",
    description: "The parameters for the action.",
    fieldType: "JSONField",
  }],
});

entryTypeEntry.addChild({
  childName: "hooks",
  label: "Hooks",
  fields: [{
    key: "hook",
    label: "Hook",
    description: "The lifecycle hook.",
    fieldType: "ChoicesField",
    choices: [{
      key: "beforeInsert",
      label: "Before Insert",
    }, {
      key: "afterInsert",
      label: "After Insert",
    }, {
      key: "beforeSave",
      label: "Before Save",
    }, {
      key: "afterSave",
      label: "After Save",
    }, {
      key: "validate",
      label: "Validate",
    }, {
      key: "beforeValidate",
      label: "Before Validate",
    }, {
      key: "beforeDelete",
      label: "Before Delete",
    }, {
      key: "afterDelete",
      label: "After Delete",
    }],
  }, {
    key: "label",
    label: "Label",
    description: "The human-readable label for the hook.",
    fieldType: "DataField",
  }, {
    key: "description",
    label: "Description",
    description: "A brief description of the hook.",
    fieldType: "TextField",
  }, {
    key: "action",
    label: "Action",
    description: "The action to perform.",
    fieldType: "TextField",
  }],
});
