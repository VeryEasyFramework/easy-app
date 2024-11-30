export interface User {
/**
 * **First Name** (DataField)
 * @description The user's first name
 * @type {string}
 * @required true
 */
firstName: string;
/**
 * **Last Name** (DataField)
 * @description The user's last name
 * @type {string}
 * @required true
 */
lastName: string;
/**
 * **Full Name** (DataField)
 * @description The user's full name. This field is automatically generated from the first and last name fields.
 * @type {string}
 */
fullName?: string;
/**
 * **Email** (DataField)
 * @description The user's email address
 * @type {string}
 * @required true
 */
email: string;
/**
 * **Password** (PasswordField)
 * @description The hashed password of the user
 * @type {string}
 */
password?: string;
/**
 * **Reset Password Token** (PasswordField)
 * @description The token used to reset the user's password
 * @type {string}
 */
resetPasswordToken?: string;
/**
 * **System Administrator** (BooleanField)
 * @description Is the user a system administrator? (admin users have access to all parts of the system)
 * @type {boolean}
 */
systemAdmin?: boolean;
/**
 * **API Token** (PasswordField)
 * @description The user's API token
 * @type {string}
 */
apiToken?: string;
}