import type { MiddlewareWithResponse } from "#/middleware/middleware.ts";
import { raiseEasyException } from "#/easyException.ts";

export const authMiddleware: MiddlewareWithResponse = async (
  app,
  request,
  response,
) => {
  if (app.isPublicAction(request.group, request.action)) {
    return response;
  }
  if (request.group === "auth" && request.action === "login") {
    return response;
  }

  const sessionId = request.cookies.get("sessionId");
  if (!sessionId) {
    raiseEasyException("Unauthorized", 401);
  }
  const session = await app.orm.getEntity("userSession", sessionId);
  if (!session) {
    response.clearCookie("sessionId");
    raiseEasyException("Unauthorized", 401);
  }
  response.setCookie("sessionId", sessionId);
  return response;
};
