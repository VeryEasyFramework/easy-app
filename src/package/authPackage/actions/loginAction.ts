import { createAction } from "#/actions/createAction.ts";

export const loginAction = createAction("login", {
  description: "Login user",
  public: true,
  async action(app, data, request, response) {
  },
  params: {
    email: {
      type: "EmailField",
      required: true,
    },
    password: {
      type: "PasswordField",
      required: true,
    },
  },
});
