export interface EditLog {
/**
 * **Entry Type** (DataField)
 * @description The entry type that was edited
 * @type {string}
 */
entryType?: string;
/**
 * **Entry ID** (DataField)
 * @description The ID of the entry that was edited
 * @type {string}
 */
entryId?: string;
/**
 * **Entry Title** (DataField)
 * @type {string}
 */
entryTitle?: string;
/**
 * **Action** (ChoicesField)
 * @description The action that was performed
 * @type {string | number}
 */
action?: string | number;
/**
 * **Edit Data** (JSONField)
 * @description The data that was changed
 * @type {Record<string, any>}
 */
editData?: Record<string, any>;
/**
 * **User** (ConnectionField)
 * @description The user who made the edit
 * @type {string}
 */
user?: string;
/**
 * **Full Name** (DataField)
 * @description The user's full name. This field is automatically generated from the first and last name fields.
 * @type {string}
 */
userFullName?: string;
}