import { createAction } from "#/actions/createAction.ts";

export const logoutAction = createAction("logout", {
  description: "Logout user",
  async action(app, data, request, response) {
    if (request.sessionData) {
      const userSessions = await app.orm.getEntityList("userSession", {
        filter: {
          user: request.sessionData.userId,
        },
        columns: ["id"],
      });

      for (const session of userSessions.data) {
        await app.orm.deleteEntity("userSession", session.id as string);
        app.cacheDelete("userSession", session.id as string);
      }
      response.clearCookie("sessionId");
      return "User logged out";
    }
    return "User is not logged in";
  },
});
