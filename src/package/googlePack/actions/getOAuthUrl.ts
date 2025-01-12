import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";

export const getOAuthUrl = createAction("getOAuthUrl", {
  description: "OAuth with Google",
  async action(app, data, request, response) {
    const oauthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    //generate the URL
    const redirectHost = `${request.origin}${request.prefix}`;
    const url = new URL(oauthEndpoint);
    const googleSettings = await app.orm.getSettings("googleSettings");
    const clientId = googleSettings.clientId;
    console.log(clientId);
    url.searchParams.append("client_id", clientId);
    url.searchParams.append(
      "redirect_uri",
      `${redirectHost}/api?group=google&action=redirect`,
    );
    url.searchParams.append("response_type", "code");
    url.searchParams.append("include_granted_scopes", "true");
    url.searchParams.append("scope", "https://www.googleapis.com/auth/drive");
    url.searchParams.append("access_type", "offline");
    url.searchParams.append("prompt", "consent");

    console.log(url.toString());

    raiseEasyException("Redirecting to Google OAuth", 302, url.toString());
  },
});
