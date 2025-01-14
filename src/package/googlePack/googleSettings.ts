import { raiseEasyException, SettingsType } from "@vef/easy-app";
import { raiseRedirect } from "#/easyException.ts";
//https://console.cloud.google.com/iam-admin/serviceaccounts/details/111419913115489213035?inv=1&invt=AbmSPw&project=vdm-app-447209&supportedpurview=project

export const googleSettings = new SettingsType("googleSettings", {
  description: "Google API settings",
  label: "Google API settings",
});

googleSettings.addFields([
  {
    key: "authStatus",
    label: "Auth Status",
    fieldType: "ChoicesField",
    defaultValue: "unauthorized",
    readOnly: true,
    choices: [
      {
        key: "unauthorized",
        label: "Unauthorized",
        color: "error",
      },
      {
        key: "authorized",
        label: "Authorized",
        color: "success",
      },
    ],
  },
  {
    key: "accessToken",
    label: "Access Token",
    fieldType: "TextField",
    hidden: true,
    readOnly: true,
  },
  {
    key: "expireTime",
    label: "Expire Time",
    fieldType: "TimeStampField",
    showTime: true,
    readOnly: true,
  },
  {
    key: "acquiredTime",
    label: "Acquired Time",
    fieldType: "TimeStampField",
    showTime: true,
  },
  {
    key: "refreshToken",
    label: "Refresh Token",
    fieldType: "TextField",
    hidden: true,
    readOnly: true,
  },
  {
    key: "tokenType",
    label: "Token Type",
    fieldType: "DataField",
    hidden: true,
  },
  {
    key: "clientId",
    label: "Client ID",
    fieldType: "TextField",
  },
  {
    key: "clientSecret",
    label: "Client Secret",
    fieldType: "TextField",
  },
  {
    key: "dbBackupFolderId",
    label: "DB Backup Folder Id",
    fieldType: "TextField",
  },
  {
    key: "redirectHost",
    label: "Redirect Host",
    description:
      "The host to redirect to after Google OAuth (e.g. http://localhost:8000)",
    fieldType: "URLField",
  },
  {
    key: "redirectFinal",
    label: "Final Redirect",
    fieldType: "URLField",
    description: "The final url to redirect to after Google OAuth completes",
  },
]);

googleSettings.addAction("authorizeGoogle", {
  label: "Authorize Google Drive",
  description: "Authorize Google Drive",
  action(googleSettings) {
    const oauthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    //generate the URL
    const redirectHost = googleSettings.redirectHost;
    const url = new URL(oauthEndpoint);
    const clientId = googleSettings.clientId;
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
    return {
      redirect: url.toString(),
    };
  },
});
export async function refreshAccessToken(creds: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}) {
  const { clientId, clientSecret, refreshToken } = creds;
  const url = new URL("https://oauth2.googleapis.com/token");
  const headers = new Headers();
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams();
  body.append("client_id", clientId);
  body.append("client_secret", clientSecret);
  body.append("refresh_token", refreshToken);
  body.append("grant_type", "refresh_token");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: body.toString(),
  });

  if (!response.ok) {
    raiseEasyException("Failed to refresh access token", response.status);
  }

  return await response.json();
}

export async function getAccessToken(creds: {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}): Promise<
  {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token?: string;
    scope?: string;
  }
> {
  const { clientId, clientSecret, code } = creds;
  const url = new URL("https://oauth2.googleapis.com/token");
  const headers = new Headers();
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams();
  body.append("client_id", clientId);
  body.append("client_secret", clientSecret);
  body.append("code", code);
  body.append("grant_type", "authorization_code");
  body.append(
    "redirect_uri",
    creds.redirectUri,
  );

  const response = await fetch(url.toString(), {
    method: "POST",
    redirect: "manual",
    headers,
    body: body.toString(),
  });

  if (!response.ok) {
    raiseEasyException("Failed to get access token", response.status);
  }

  return await response.json();
}
