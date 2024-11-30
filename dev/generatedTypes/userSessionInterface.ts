export interface UserSession {
/**
 * **User** (ConnectionField)
 * @type {string}
 */
user?: string;
/**
 * **Session Data** (JSONField)
 * @type {Record<string, any>}
 */
sessionData?: Record<string, any>;
/**
 * **Full Name** (DataField)
 * @description The user's full name. This field is automatically generated from the first and last name fields.
 * @type {string}
 */
userFullName?: string;
}