import { raiseEasyException } from "#/easyException.ts";
import { createMiddleware } from "#/middleware/middleware.ts";
import type { EasyRequest } from "#/easyRequest.ts";
import type { EasyApp } from "#/easyApp.ts";

export const authMiddleware = createMiddleware(async (
  app,
  request,
  response,
) => {
  if (isAllowed(app, request)) {
    return;
  }

  // const sessionId = request.cookies.get("sessionId");
  // if (!sessionId) {
  //   raiseEasyException("Unauthorized", 401);
  // }
  // const session = await app.orm.getEntity("userSession", sessionId);
  // if (!session) {
  //   response.clearCookie("sessionId");
  //   raiseEasyException("Unauthorized", 401);
  // }
  // response.setCookie("sessionId", sessionId);
});

function isAllowed(app: EasyApp, request: EasyRequest): boolean {
  if (request.path !== "/api") {
    return true;
  }
  if (request.method === "OPTIONS") {
    return true;
  }
  if (request.isFile) {
    return true;
  }
  if (app.isPublicAction(request.group, request.action)) {
    return true;
  }
  return false;
}
