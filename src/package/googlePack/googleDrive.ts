// https://developers.google.com/drive/api/guides/manage-uploads

import { EasyApp, raiseEasyException } from "@vef/easy-app";
import { refreshAccessToken } from "#/package/googlePack/googleSettings.ts";

const uploadEndpoint = "https://www.googleapis.com/upload/drive/v3/files";
const serviceAccountEndpoint =
  "POST https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/";
export type GoogleFileUploadType = "resumable" | "media" | "multipart";

export const googleApi = {
  uploadEndpoint,
  serviceAccountEndpoint,
};

export interface GoogleDriveFileMetadata {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
}

export async function uploadResumable(config: {
  filePath: string;
  mimeType: string;
  accessToken: string;
  uploadUri: string;
}): Promise<GoogleDriveFileMetadata> {
  const filePath = `${config.filePath}`;

  const file = Deno.readFileSync(filePath);

  const headers = new Headers();

  headers.set("Content-Length", file.byteLength.toString());
  const url = new URL(config.uploadUri);
  url.searchParams.set("supportsAllDrives", "true");
  headers.set(
    "Content-Range",
    `bytes 0-${file.byteLength - 1}/${file.byteLength}`,
  );

  headers.set("Content-Type", config.mimeType);
  headers.set("Authorization", `Bearer ${config.accessToken}`);

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers,
    body: file,
  });
  if (!response.ok) {
    console.log(await response.text());
    raiseEasyException(
      `Failed to upload file to Google Drive: ${response.statusText}`,
      response.status,
    );
  }
  return await response.json() as GoogleDriveFileMetadata;
}

export async function createUploadSession(orm: EasyApp["orm"], config: {
  fileName: string;
  folderId?: string;
  mimeType: string;
}): Promise<string> {
  const headers = new Headers();
  headers.set("X-Upload-Content-Type", config.mimeType);

  const url = new URL(uploadEndpoint);
  url.searchParams.set("uploadType", "resumable");
  url.searchParams.set("supportsAllDrives", "true");
  const response = await googleApiCall(orm, {
    endpoint: url.toString(),
    method: "POST",
    headers,
    body: {
      name: config.fileName,
      parents: [config.folderId],
      mimeType: config.mimeType,
    },
  });
  return response?.headers.get("Location") || "";
}

async function googleApiCall(orm: EasyApp["orm"], config: {
  endpoint: string;
  method: string;
  headers: Headers;
  body?: Record<string, any>;
}): Promise<Response | undefined> {
  const { endpoint, method, headers } = config;
  const googleSettings = await orm.getSettings("googleSettings");
  headers.set("Content-Type", "application/json;charset=UTF-8");
  headers.set(
    "Authorization",
    `Bearer ${googleSettings.accessToken}`,
  );
  console.log({ body: config.body });
  const response = await fetch(endpoint, {
    method,
    headers,
    body: config.body ? JSON.stringify(config.body) : undefined,
  });
  if (!response.ok) {
    if (response.status === 401) {
      const tokenObject = await refreshAccessToken({
        clientId: googleSettings.clientId,
        clientSecret: googleSettings.clientSecret,
        refreshToken: googleSettings.refreshToken,
      });

      console.log(tokenObject);
      if (!tokenObject) {
        return;
      }
      const tokenMap = new Map<string, string>();

      for (const [key, value] of Object.entries(tokenObject)) {
        tokenMap.set(key, value as string);
      }
      googleSettings.acquiredTime = Date.now();
      googleSettings.accessToken = tokenMap.get("access_token") || "";
      googleSettings.expireTime = googleSettings.acquiredTime +
        (parseInt(tokenMap.get("expires_in") || "0") * 1000);
      if (tokenMap.has("refresh_token")) {
        googleSettings.refreshToken = tokenMap.get("refresh_token") || "";
      }

      googleSettings.tokenType = tokenMap.get("token_type") || "";

      await googleSettings.save();
      return await googleApiCall(orm, config);
    }
    raiseEasyException(
      `Failed to call Google API: ${response.statusText}`,
      response.status,
    );
  }
  return response;
}
