import { raiseEasyException } from "#/easyException.ts";
import { createMiddleware } from "#/middleware/middleware.ts";
import type { EasyRequest } from "#/easyRequest.ts";
import type { EasyApp } from "#/easyApp.ts";
import { OrmException } from "../../../../../easy-orm/mod.ts";

export const authMiddleware = createMiddleware(async (
  app,
  request,
  response,
) => {
  if (isAllowed(app, request)) {
    return;
  }

  const sessionId = request.cookies.get("sessionId");
  if (!sessionId) {
    raiseEasyException("Unauthorized", 401);
  }

  const sessionData = await loadSessionData(app, sessionId);
  if (!sessionData) {
    response.clearCookie("sessionId");
    raiseEasyException("Unauthorized", 401);
  }
  request.sessionData = sessionData;
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

async function loadSessionData(app: EasyApp, sessionId: string) {
  let sessionData = app.cacheGet("userSession", sessionId);
  if (!sessionData) {
    try {
      const entity = await app.orm.getEntity("userSession", sessionId);
      sessionData = entity.sessionData;
      app.cacheSet("userSession", sessionId, sessionData);
    } catch (e) {
      if (e instanceof OrmException && e.type === "EntityNotFound") {
        return null;
      }
      throw e;
    }
  }
  return sessionData;
}
