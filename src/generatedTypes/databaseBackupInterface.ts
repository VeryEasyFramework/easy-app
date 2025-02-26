import type { Entry } from "#orm/entry/entry/entryType/entry.ts";

export interface DatabaseBackup extends Entry {
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
  uploadStatus?: "pending" | "inProgress" | "completed" | "failed";
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
  /**
   * **Saved Locally** (BooleanField)
   * @type {boolean}
   */
  savedLocally?: boolean;
  /**
   * **File Name** (DataField)
   * @type {string}
   * @required true
   */
  uploadEntryFileName: string;
}
