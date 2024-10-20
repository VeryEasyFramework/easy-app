import { createAction } from "#/actions/createAction.ts";

export const sendEmailAction = createAction("sendEmail", {
  description: "Send an email",
  async action(app, { body, subject, recipientEmail, recipientName }, request) {
    const email = await app.orm.createEntity("email", {
      senderName: app.config.appName,
      recipientEmail,
      recipientName,
      subject,
      body,
    });

    await email.enqueueAction("send");
    return { message: "Email queued for sending" };
  },
  params: {
    recipientEmail: {
      type: "EmailField",
      required: true,
    },
    recipientName: {
      type: "DataField",
      required: false,
    },
    subject: {
      type: "TextField",
      required: true,
    },
    body: {
      type: "TextField",
      required: true,
    },
  },
});
