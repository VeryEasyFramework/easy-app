export interface TaskQueue {
/**
 * **Task Type** (ChoicesField)
 * @type {string | number}
 * @required true
 */
taskType: string | number;
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
 * @type {string | number}
 * @required true
 */
worker: string | number;
/**
 * **Result Data** (JSONField)
 * @type {Record<string, any>}
 */
resultData?: Record<string, any>;
/**
 * **Status** (ChoicesField)
 * @type {string | number}
 * @required true
 */
status: string | number;
}