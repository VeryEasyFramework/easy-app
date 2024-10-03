import { raiseEasyException } from "#/easyException.ts";
import { createMiddleware } from "#/middleware/middleware.ts";
import type { EasyRequest } from "#/easyRequest.ts";
import type { EasyApp } from "#/easyApp.ts";
import { OrmException, SafeType } from "@vef/easy-orm";
import { SessionData } from "#/package/authPack/entities/userSession.ts";

export const authMiddleware = createMiddleware(async (
  app,
  request,
  response,
) => {
  if (isAllowed(app, request)) {
    return;
  }
  const isAuthenticatedWithToken = await processAuthToken(app, request);
  if (isAuthenticatedWithToken) {
    return;
  }
  const sessionId = request.cookies.get("userSession");
  if (!sessionId) {
    raiseEasyException("Unauthorized", 401);
  }

  const sessionData = await loadSessionData(app, sessionId);
  if (!sessionData) {
    response.clearCookie("userSession");
    raiseEasyException("Unauthorized", 401);
  }
  request.sessionData = sessionData;
  request.user = {
    id: sessionData.userId,
    firstName: sessionData.firstName,
    lastName: sessionData.lastName,
  };
});

async function processAuthToken(
  app: EasyApp,
  request: EasyRequest,
): Promise<boolean> {
  if (!request.authToken) {
    return false;
  }
  const token = request.authToken;
  let userRecord = app.cacheGet("userToken", request.authToken) as Record<
    string,
    SafeType
  >;
  if (!userRecord) {
    const user = await app.orm.findEntity("user", {
      apiToken: token,
    });

    if (!user) {
      return false;
    }
    userRecord = user.data;
    app.cacheSet("userToken", token, userRecord);
  }
  request.user = {
    id: userRecord.id as string,
    firstName: userRecord.firstName as string,
    lastName: userRecord.lastName as string,
  };
  return true;
}

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
