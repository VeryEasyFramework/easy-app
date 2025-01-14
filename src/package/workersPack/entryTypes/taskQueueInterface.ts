export interface TaskQueue {
/**
 * **Task Type** (ChoicesField)
 * @type {'entry' | 'settings' | 'app'}
 * @required true
 */
taskType: 'entry' | 'settings' | 'app';
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
 * @type {'short' | 'medium' | 'long'}
 * @required true
 */
worker: 'short' | 'medium' | 'long';
/**
 * **Result Data** (JSONField)
 * @type {Record<string, any>}
 */
resultData?: Record<string, any>;
/**
 * **Status** (ChoicesField)
 * @type {'queued' | 'running' | 'completed' | 'failed'}
 * @required true
 */
status: 'queued' | 'running' | 'completed' | 'failed';
}