import type { Entry } from "#orm/entry/entry/entryType/entry.ts";

export interface User extends Entry {
  /**
   * **Password** (PasswordField)
   * @type {string}
   */
  password?: string;
  /**
   * **Last Login** (TimeStampField)
   * @type {number}
   */
  lastLogin?: number;
  /**
   * **Is Superuser** (BooleanField)
   * @type {boolean}
   */
  isSuperuser?: boolean;
  /**
   * **Email** (EmailField)
   * @type {string}
   */
  email?: string;
  /**
   * **Name** (DataField)
   * @type {string}
   */
  name?: string;
  /**
   * **First Name** (DataField)
   * @type {string}
   */
  firstName?: string;
  /**
   * **Last Name** (DataField)
   * @type {string}
   */
  lastName?: string;
  /**
   * **Full Name** (DataField)
   * @type {string}
   */
  fullName?: string;
  /**
   * **Is Staff** (BooleanField)
   * @type {boolean}
   */
  isStaff?: boolean;
  /**
   * **Is Active** (BooleanField)
   * @type {boolean}
   */
  isActive?: boolean;
  /**
   * **Date Joined** (TimeStampField)
   * @type {number}
   */
  dateJoined?: number;
  /**
   * **System Admin** (BooleanField)
   * @type {boolean}
   */
  systemAdmin?: boolean;
  /**
   * **Api Token** (DataField)
   * @type {string}
   */
  apiToken?: string;
}
