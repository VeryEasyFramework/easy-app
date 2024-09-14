import { createAction } from "#/actions/createAction.ts";

export const authCheckAction = createAction("authCheck", {
  description: "Check if user is authenticated",
  async action(app, data, request, response) {
    return request.sessionData;
  },
});
