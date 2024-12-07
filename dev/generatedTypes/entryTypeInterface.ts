export interface EntryType {
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
 * @type {string | number}
 */
idMethod?: string | number;
/**
 * **Order Field** (DataField)
 * @description The field to use for the order of records when fetching a list of records from the database.
 * @type {string}
 */
orderField?: string;
/**
 * **Order Direction** (ChoicesField)
 * @description The direction to order records when fetching a list of records from the database. This defaults to 'asc'.
 * @type {string | number}
 */
orderDirection?: string | number;
}