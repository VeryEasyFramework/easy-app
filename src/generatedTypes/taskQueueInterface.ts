import type { Entry } from "#orm/entry/entry/entryType/entry.ts";
export interface TaskQueue extends Entry {
  /**
   * **Task Type** (ChoicesField)
   * @type {'entry' | 'settings' | 'app'}
   * @required true
   */
  taskType: "entry" | "settings" | "app";
  /**
   * **Entry Type** (DataField)
   * @type {string}
   */
  entryType?: string;
  /**
   * **Entry Id** (DataField)
   * @type {string}
   */
  entryId?: string;
  /**
   * **Entry Title** (DataField)
   * @type {string}
   */
  entryTitle?: string;
  /**
   * **Group** (DataField)
   * @type {string}
   */
  group?: string;
  /**
   * **Action** (DataField)
   * @type {string}
   */
  action?: string;
  /**
   * **Task Data** (JSONField)
   * @type {Record<string, any>}
   */
  taskData?: Record<string, any>;
  /**
   * **Title** (DataField)
   * @type {string}
   */
  title?: string;
  /**
   * **Worker** (ChoicesField)
   * @type {'short' | 'medium' | 'long'}
   * @required true
   */
  worker: "short" | "medium" | "long";
  /**
   * **Result Data** (JSONField)
   * @type {Record<string, any>}
   */
  resultData?: Record<string, any>;
  /**
   * **Status** (ChoicesField)
   * @type {'queued' | 'running' | 'cancelled' | 'completed' | 'failed'}
   * @required true
   */
  status: "queued" | "running" | "cancelled" | "completed" | "failed";
  /**
   * **Queued At** (TimeStampField)
   * @type {number}
   */
  queuedAt?: number;
  /**
   * **Start Time** (TimeStampField)
   * @type {number}
   */
  startTime?: number;
  /**
   * **End Time** (TimeStampField)
   * @type {number}
   */
  endTime?: number;
}
