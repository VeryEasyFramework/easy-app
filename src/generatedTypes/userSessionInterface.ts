import type { Entry } from "#orm/entry/entry/entryType/entry.ts";
export interface UserSession extends Entry {
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
