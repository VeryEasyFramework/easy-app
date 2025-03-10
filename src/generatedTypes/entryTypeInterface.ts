import type { Entry } from "#orm/entry/entry/entryType/entry.ts";
import type { ChildList } from "#orm/entry/child/childRecord.ts";
export interface EntryType extends Entry {
  /**
   * **Entry Type** (DataField)
   * @description The type of entry in camelCase. This is used as the ID for this Entry.
   * @type {string}
   * @required true
   */
  entryType: string;
  /**
   * **Label** (DataField)
   * @description The human-readable label for this Entry.
   * @type {string}
   * @required true
   */
  label: string;
  /**
   * **Description** (TextField)
   * @description A brief description of this Entry.
   * @type {string}
   */
  description?: string;
  /**
   * **Title Field** (DataField)
   * @description The field to use as the title for this Entry in the UI instead of the ID. If not provided, the Entry's ID will be used.
   * @type {string}
   */
  titleField?: string;
  /**
   * **Status Field** (DataField)
   * @description The field to use as the status for this Entry in the UI. This field should be a Choices field.
   * @type {string}
   */
  statusField?: string;
  /**
   * **Table Name** (DataField)
   * @description The name of the table in the database where this Entry is stored. This defaults to the camelCase version of the Entry's name.
   * @type {string}
   */
  tableName?: string;
  /**
   * **Edit Log** (BooleanField)
   * @description If true, this Entry has an edit log that tracks changes to records. This defaults to false.
   * @type {boolean}
   */
  editLog?: boolean;
  /**
   * **ID Method** (ChoicesField)
   * @description The method used to generate unique identifiers for this Entry. If not provided, the Entry will use the `HashMethod` with a hash length of 16.
   * @type {'number' | 'uuid' | 'hash' | 'data' | 'series' | 'field'}
   */
  idMethod?: "number" | "uuid" | "hash" | "data" | "series" | "field";
  /**
   * **Order Field** (DataField)
   * @description The field to use for the order of records when fetching a list of records from the database.
   * @type {string}
   */
  orderField?: string;
  /**
   * **Order Direction** (ChoicesField)
   * @description The direction to order records when fetching a list of records from the database. This defaults to 'asc'.
   * @type {'asc' | 'desc'}
   */
  orderDirection?: "asc" | "desc";
  fields: ChildList<{
    /**
     * **Key** (DataField)
     * @description The key for the field in camelCase.
     * @type {string}
     */
    key?: string;
    /**
     * **Label** (DataField)
     * @description The human-readable label for the field.
     * @type {string}
     */
    label?: string;
    /**
     * **Description** (TextField)
     * @description A brief description of the field.
     * @type {string}
     */
    description?: string;
    /**
     * **Field Type** (ChoicesField)
     * @description The type of field.
     * @type {'IDField' | 'DataField' | 'IntField' | 'BigIntField' | 'DecimalField' | 'DateField' | 'TimeStampField' | 'BooleanField' | 'PasswordField' | 'ChoicesField' | 'MultiChoiceField' | 'TextField' | 'EmailField' | 'ImageField' | 'JSONField' | 'PhoneField' | 'ConnectionField' | 'RichTextField' | 'URLField' | 'ListField' | 'CurrencyField'}
     */
    fieldType?:
      | "IDField"
      | "DataField"
      | "IntField"
      | "BigIntField"
      | "DecimalField"
      | "DateField"
      | "TimeStampField"
      | "BooleanField"
      | "PasswordField"
      | "ChoicesField"
      | "MultiChoiceField"
      | "TextField"
      | "EmailField"
      | "ImageField"
      | "JSONField"
      | "PhoneField"
      | "ConnectionField"
      | "RichTextField"
      | "URLField"
      | "ListField"
      | "CurrencyField";
    /**
     * **Required** (BooleanField)
     * @description If true, this field is required.
     * @type {boolean}
     */
    required?: boolean;
  }>;
  actions: ChildList<{
    /**
     * **Key** (DataField)
     * @description The key for the action in camelCase.
     * @type {string}
     */
    key?: string;
    /**
     * **Label** (DataField)
     * @description The human-readable label for the action.
     * @type {string}
     */
    label?: string;
    /**
     * **Description** (TextField)
     * @description A brief description of the action.
     * @type {string}
     */
    description?: string;
    /**
     * **Action** (TextField)
     * @description The action to perform.
     * @type {string}
     */
    action?: string;
    /**
     * **Params** (JSONField)
     * @description The parameters for the action.
     * @type {Record<string, any>}
     */
    params?: Record<string, any>;
  }>;
  hooks: ChildList<{
    /**
     * **Hook** (ChoicesField)
     * @description The lifecycle hook.
     * @type {'beforeInsert' | 'afterInsert' | 'beforeSave' | 'afterSave' | 'validate' | 'beforeValidate' | 'beforeDelete' | 'afterDelete'}
     */
    hook?:
      | "beforeInsert"
      | "afterInsert"
      | "beforeSave"
      | "afterSave"
      | "validate"
      | "beforeValidate"
      | "beforeDelete"
      | "afterDelete";
    /**
     * **Label** (DataField)
     * @description The human-readable label for the hook.
     * @type {string}
     */
    label?: string;
    /**
     * **Description** (TextField)
     * @description A brief description of the hook.
     * @type {string}
     */
    description?: string;
    /**
     * **Action** (TextField)
     * @description The action to perform.
     * @type {string}
     */
    action?: string;
  }>;
}
