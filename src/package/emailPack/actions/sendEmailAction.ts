import { createAction } from "#/actions/createAction.ts";

export const sendEmailAction = createAction("sendEmail", {
  description: "Send an email",
  async action(app) {},
  params: {
    to: {
      type: "EmailField",
      required: true,
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
