export interface UserSession {
/**
 * **User ID** (IntField)
 * @type {number}
 */
userId?: number;
/**
 * **Session Data** (JSONField)
 * @type {Record<string, any>}
 */
sessionData?: Record<string, any>;
}