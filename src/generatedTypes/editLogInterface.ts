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
 * @type {'create' | 'update' | 'delete'}
 */
action?: 'create' | 'update' | 'delete';
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
 * **Name** (DataField)
 * @type {string}
 */
userName?: string;
}