import { raiseEasyException, SettingsType } from "@vef/easy-app";
//https://console.cloud.google.com/iam-admin/serviceaccounts/details/111419913115489213035?inv=1&invt=AbmSPw&project=vdm-app-447209&supportedpurview=project

export const googleSettings = new SettingsType("googleSettings", {
  description: "Google API settings",
  label: "Google API settings",
});

googleSettings.addFields([
  {
    key: "accessToken",
    label: "Access Token",
    fieldType: "TextField",
  },
  {
    key: "expireTime",
    label: "Expire Time",
    fieldType: "TimeStampField",
    showTime: true,
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
  },
  {
    key: "tokenType",
    label: "Token Type",
    fieldType: "DataField",
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
]);

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
    "http://localhost:8000/v2/api?group=google&action=redirect",
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
