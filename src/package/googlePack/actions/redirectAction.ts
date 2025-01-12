import { createAction } from "#/actions/createAction.ts";
import { getAccessToken } from "#/package/googlePack/googleSettings.ts";
import { raiseEasyException } from "#/easyException.ts";

export const redirectAction = createAction("redirect", {
  description: "Redirect from Google OAuth",
  async action(app, data, request, response) {
    console.log(request.request.url);
    const googleSettings = await app.orm.getSettings("googleSettings");

    const { code, scope } = data;
    const token = await getAccessToken({
      code,
      clientId: googleSettings.clientId,
      clientSecret: googleSettings.clientSecret,
    });
    console.log(token);
    googleSettings.accessToken = token.access_token;
    googleSettings.acquiredTime = new Date().getTime();
    googleSettings.expireTime = googleSettings.acquiredTime +
      token.expires_in * 1000;
    googleSettings.tokenType = token.token_type;
    googleSettings.refreshToken = token.refresh_token;
    googleSettings.scope = token.scope;

    await googleSettings.save();
    raiseEasyException("Access token acquired", 302, "/v2/api?group=google");
  },
  params: {
    code: {
      type: "TextField",
      required: true,
    },
    scope: {
      type: "TextField",
      required: true,
    },
  },
});
