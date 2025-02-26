import type { Entry } from "#orm/entry/entry/entryType/entry.ts";
export interface GoogleUpload extends Entry {
  /**
   * **Session URI** (URLField)
   * @type {string}
   */
  sessionUri?: string;
  /**
   * **Upload Status** (ChoicesField)
   * @type {'pending' | 'inProgress' | 'completed' | 'failed'}
   */
  uploadStatus?: "pending" | "inProgress" | "completed" | "failed";
  /**
   * **Upload Type** (ChoicesField)
   * @type {'resumable' | 'media' | 'multipart'}
   * @required true
   */
  uploadType: "resumable" | "media" | "multipart";
  /**
   * **File Path** (DataField)
   * @type {string}
   * @required true
   */
  filePath: string;
  /**
   * **System Path** (TextField)
   * @type {string}
   */
  systemPath?: string;
  /**
   * **File Id** (DataField)
   * @type {string}
   */
  fileId?: string;
  /**
   * **Folder Id** (DataField)
   * @type {string}
   */
  folderId?: string;
  /**
   * **File Link** (URLField)
   * @type {string}
   */
  fileLink?: string;
  /**
   * **Folder Link** (URLField)
   * @type {string}
   */
  folderLink?: string;
  /**
   * **File Name** (DataField)
   * @type {string}
   * @required true
   */
  fileName: string;
  /**
   * **File Mime Type** (DataField)
   * @type {string}
   */
  fileMimeType?: string;
  /**
   * **File Kind** (DataField)
   * @type {string}
   */
  fileKind?: string;
  /**
   * **File Size** (DataField)
   * @type {string}
   */
  fileSize?: string;
}
