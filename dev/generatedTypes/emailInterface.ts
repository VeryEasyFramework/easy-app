export interface Email {
/**
 * **Sender's Email** (EmailField)
 * @description The email address of the sender
 * @type {string}
 */
senderEmail?: string;
/**
 * **Sender's Name** (DataField)
 * @description The name of the sender
 * @type {string}
 */
senderName?: string;
/**
 * **Recipient's Name** (DataField)
 * @description The name of the recipient
 * @type {string}
 */
recipientName?: string;
/**
 * **Recipient's Email** (EmailField)
 * @description The email address of the recipient
 * @type {string}
 * @required true
 */
recipientEmail: string;
/**
 * **Subject** (TextField)
 * @description The subject of the email
 * @type {string}
 */
subject?: string;
/**
 * **Content Type** (ChoicesField)
 * @description The content type of the email
 * @type {string | number}
 */
contentType?: string | number;
/**
 * **Body** (TextField)
 * @description The body of the email
 * @type {string}
 */
body?: string;
/**
 * **Status** (ChoicesField)
 * @description The status of the email
 * @type {string | number}
 */
status?: string | number;
}