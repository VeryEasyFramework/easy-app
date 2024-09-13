import { createAction } from "#/actions/createAction.ts";

export const logoutAction = createAction("logout", {
  description: "Logout user",
  public: true,
  async action(app, data, request, response) {
  },
});
