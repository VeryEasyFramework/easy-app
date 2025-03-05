import type { Entry } from "@vef/easy-app";
export interface EmailAccount extends Entry {
/**
 * **Email Account** (EmailField)
 * @description The email account to send emails from
 * @type {string}
 * @required true
 */
emailAccount: string;
/**
 * **Use Gmail OAuth** (BooleanField)
 * @description Use OAuth to authenticate with Gmail
 * @type {boolean}
 */
useGmailOauth?: boolean;
/**
 * **Send Emails** (BooleanField)
 * @description Whether this email account can send emails
 * @type {boolean}
 */
sendEmails?: boolean;
/**
 * **Receive Emails** (BooleanField)
 * @description Whether this email account can receive emails
 * @type {boolean}
 */
receiveEmails?: boolean;
/**
 * **SMTP Host** (TextField)
 * @description The host of the SMTP server
 * @type {string}
 */
smtpHost?: string;
/**
 * **SMTP Port** (IntField)
 * @description The port of the SMTP server
 * @type {number}
 */
smtpPort?: number;
/**
 * **SMTP User** (DataField)
 * @description The user to authenticate with the SMTP server
 * @type {string}
 */
smtpUser?: string;
/**
 * **SMTP Password** (PasswordField)
 * @description The password to authenticate with the SMTP server
 * @type {string}
 */
smtpPassword?: string;
/**
 * **Access Token** (TextField)
 * @type {string}
 */
accessToken?: string;
/**
 * **Expire Time** (TimeStampField)
 * @type {number}
 */
expireTime?: number;
/**
 * **Acquired Time** (TimeStampField)
 * @type {number}
 */
acquiredTime?: number;
/**
 * **Refresh Token** (TextField)
 * @type {string}
 */
refreshToken?: string;
/**
 * **Token Type** (DataField)
 * @type {string}
 */
tokenType?: string;
/**
 * **Client ID** (TextField)
 * @type {string}
 */
clientId?: string;
/**
 * **Client Secret** (TextField)
 * @type {string}
 */
clientSecret?: string;
}