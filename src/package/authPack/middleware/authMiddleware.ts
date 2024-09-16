import { raiseEasyException } from "#/easyException.ts";
import { createMiddleware } from "#/middleware/middleware.ts";
import type { EasyRequest } from "#/easyRequest.ts";
import type { EasyApp } from "#/easyApp.ts";
import { OrmException, type SafeType } from "@vef/easy-orm";
import { SessionData } from "../entities/userSession.ts";

export const authMiddleware = createMiddleware(async (
  app,
  request,
  response,
) => {
  if (isAllowed(app, request)) {
    return;
  }

  const sessionId = request.cookies.get("userSessionId");
  if (!sessionId) {
    raiseEasyException("Unauthorized", 401);
  }

  const sessionData = await loadSessionData(app, sessionId);
  if (!sessionData) {
    response.clearCookie("userSessionId");
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

async function loadSessionData(
  app: EasyApp,
  sessionId: string,
): Promise<SessionData | null> {
  let sessionData = app.cacheGet("userSession", sessionId) as SessionData;
  if (!sessionData) {
    try {
      const entity = await app.orm.getEntity("userSession", sessionId);
      sessionData = entity.sessionData as SessionData;
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
