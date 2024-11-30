import type { EasyApp } from "#/app/easyApp.ts";
import type { EasyRequest } from "#/app/easyRequest.ts";
import { raiseEasyException } from "#/easyException.ts";
import type { EasyResponse } from "#/app/easyResponse.ts";

export async function handleApi(
  app: EasyApp,
  request: EasyRequest,
  response: EasyResponse,
) {
  if (!request.group) {
    return app.apiDocs;
  }
  const requestGroup = request.group;
  const requestAction = request.action;
  if (!requestAction) {
    return app.getActionGroupDocs(requestGroup);
  }
  if (!app.actions[requestGroup]) {
    raiseEasyException(`No group found for ${requestGroup}`, 404);
  }

  if (!app.actions[requestGroup][requestAction]) {
    raiseEasyException(
      `No action found for ${requestGroup}:${requestAction}`,
      404,
    );
  }
  const action = app.actions[requestGroup][requestAction];

  if (action.system) {
    raiseEasyException("Not allowed", 403);
  }

  await request.loadBody();

  const content = await action.action(app, request.body, request, response);
  if (typeof content === "string") {
    return {
      message: content,
    };
  }
  return content || {};
}
