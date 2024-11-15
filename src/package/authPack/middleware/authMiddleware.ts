import { raiseEasyException } from "#/easyException.ts";
import { createMiddleware } from "#/middleware/middleware.ts";
import type { EasyRequest } from "#/app/easyRequest.ts";
import type { EasyApp } from "#/app/easyApp.ts";

import type { SessionData } from "#/package/authPack/entities/userSession.ts";
import type { SafeType, User } from "@vef/types";
import { OrmException } from "#orm/ormException.ts";

export const authMiddleware = createMiddleware(async (
  app,
  request,
  response,
) => {
  const isAuthenticatedWithToken = await processAuthToken(app, request);
  if (isAllowed(app, request)) {
    return;
  }
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
  const userRecord = app.cacheGet("userToken", request.authToken) as User;
  if (userRecord) {
    request.user = userRecord;
    return true;
  }

  const user = await app.orm.findEntity("user", {
    apiToken: token,
  });
  if (user) {
    request.user = {
      id: user.id as string,
      firstName: user.firstName as string,
      lastName: user.lastName as string,
    };
    app.cacheSet("userToken", token, request.user);
    return true;
  }

  const sessionData = await loadSessionData(app, token);

  if (!sessionData) {
    return false;
  }

  request.user = {
    id: sessionData.userId,
    firstName: sessionData.firstName,
    lastName: sessionData.lastName,
  };

  app.cacheSet("userToken", token, userRecord);

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
      const entity = await app.orm.getEntry("userSession", sessionId);
      sessionData = entity.sessionData as SessionData;
      app.cacheSet("userSession", sessionId, sessionData);
    } catch (e) {
      if (e instanceof OrmException && e.type === "EntryTypeNotFound") {
        return null;
      }
      throw e;
    }
  }
  return sessionData;
}
