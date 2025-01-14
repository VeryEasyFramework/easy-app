import { createAction } from "#/actions/createAction.ts";
import { getAccessToken } from "#/package/googlePack/googleSettings.ts";
import { raiseRedirect } from "#/easyException.ts";

export const redirectAction = createAction("redirect", {
  description: "Redirect from Google OAuth",
  async action(app, data, request, response) {
    const googleSettings = await app.orm.getSettings("googleSettings");

    const { code, scope } = data;
    const token = await getAccessToken({
      code,
      clientId: googleSettings.clientId,
      clientSecret: googleSettings.clientSecret,
    });
    googleSettings.accessToken = token.access_token;
    googleSettings.acquiredTime = new Date().getTime();
    googleSettings.expireTime = googleSettings.acquiredTime +
      token.expires_in * 1000;
    googleSettings.tokenType = token.token_type;
    googleSettings.refreshToken = token.refresh_token;
    googleSettings.scope = token.scope;
    googleSettings.authStatus = "authorized";

    await googleSettings.save();
    const redirectFinal = googleSettings.redirectFinal;
    raiseRedirect(`${redirectFinal}`);
    // raiseEasyException("Access token acquired", 302, "/v2/api?group=google");
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
