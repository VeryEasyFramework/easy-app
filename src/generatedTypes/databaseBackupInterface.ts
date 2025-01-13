export interface DatabaseBackup {
/**
 * **Backup Date** (TimeStampField)
 * @type {number}
 */
backupDate?: number;
/**
 * **Backup File Name** (DataField)
 * @type {string}
 */
backupFileName?: string;
/**
 * **Upload Status** (ChoicesField)
 * @type {'pending' | 'inProgress' | 'completed' | 'failed'}
 */
uploadStatus?: 'pending' | 'inProgress' | 'completed' | 'failed';
/**
 * **File URL** (URLField)
 * @type {string}
 */
fileUrl?: string;
/**
 * **Upload Entry** (ConnectionField)
 * @type {string}
 */
uploadEntry?: string;
}