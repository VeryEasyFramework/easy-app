import { EntryType, raiseEasyException } from "@vef/easy-app";
import {
  createUploadSession,
  uploadResumable,
} from "#/package/googlePack/googleDrive.ts";
import type { GoogleUpload } from "#/generatedTypes/googleUploadInterface.ts";

export const googleUploadEntry = new EntryType<GoogleUpload>("googleUpload", {
  description: "Google Drive resumable file upload",
  label: "Google File Upload",
});

googleUploadEntry.setConfig({
  titleField: "fileName",
});

googleUploadEntry.addFields([
  {
    key: "sessionUri",
    label: "Session URI",
    fieldType: "URLField",
  },
  {
    key: "uploadStatus",
    label: "Upload Status",
    fieldType: "ChoicesField",
    defaultValue: "pending",
    inList: true,
    choices: [{
      key: "pending",
      label: "Pending",
    }, {
      key: "inProgress",
      label: "In Progress",
    }, {
      key: "completed",
      label: "Completed",
    }, {
      key: "failed",
      label: "Failed",
    }],
  },
  {
    key: "uploadType",
    label: "Upload Type",
    fieldType: "ChoicesField",
    required: true,
    defaultValue: "resumable",
    choices: [{
      key: "resumable",
      label: "Resumable",
    }, {
      key: "media",
      label: "Media",
    }, {
      key: "multipart",
      label: "Multipart",
    }],
  },
  {
    key: "filePath",
    label: "File Path",
    fieldType: "DataField",
    inList: true,
    required: true,
  },
  {
    key: "systemPath",
    label: "System Path",
    fieldType: "TextField",
    hidden: true,
  },
  {
    key: "fileId",
    label: "File Id",
    fieldType: "DataField",
    inList: true,
    readOnly: true,
  },
  {
    key: "folderId",
    label: "Folder Id",
    fieldType: "DataField",
    readOnly: true,
  },
  {
    key: "fileLink",
    label: "File Link",
    fieldType: "URLField",
    inList: true,
    readOnly: true,
  },
  {
    key: "folderLink",
    label: "Folder Link",
    fieldType: "URLField",
    inList: true,
    readOnly: true,
  },
  {
    key: "fileName",
    label: "File Name",
    fieldType: "DataField",
    inList: true,
    required: true,
  },
  {
    key: "fileMimeType",
    label: "File Mime Type",
    fieldType: "DataField",
  },
  {
    key: "fileKind",
    label: "File Kind",
    fieldType: "DataField",
  },
  {
    key: "fileSize",
    label: "File Size",
    fieldType: "DataField",
  },
]);

googleUploadEntry.addAction("upload", {
  description: "Upload a file to Google Drive",
  label: "Upload",
  async action(upload) {
    const googleSettings = await upload.orm.getSettings("googleSettings");
    const { orm } = upload;
    const sessionUri = await createUploadSession(orm, {
      fileName: upload.fileName,
      folderId: googleSettings.dbBackupFolderId,
      mimeType: upload.fileMimeType || "application/octet-stream",
    });
    if (!sessionUri) {
      raiseEasyException("Failed to create upload session", 400);
    }
    upload.sessionUri = sessionUri;
    upload.uploadStatus = "inProgress";
    upload.folderId = googleSettings.dbBackupFolderId;
    await upload.save();
    const filePath =
      `${upload.orm.app.config.appRootPath}/files/${upload.filePath}`;
    const file = Deno.readFileSync(filePath);

    const headers = new Headers();
    headers.set("Content-Length", file.byteLength.toString());
    headers.set(
      "Content-Range",
      `bytes 0-${file.byteLength - 1}/${file.byteLength}`,
    );
    headers.set("Content-Type", "application/octet-stream");

    switch (upload.uploadType) {
      case "resumable": {
        if (!upload.sessionUri) {
          return;
        }
        const result = await uploadResumable({
          accessToken: googleSettings.accessToken,
          filePath,
          mimeType: upload.fileMimeType || "application/octet-stream",
          uploadUri: upload.sessionUri,
        });
        upload.fileId = result.id;
        upload.fileKind = result.kind;
        upload.fileName = result.name;
        upload.fileMimeType = result.mimeType;
        upload.fileLink = `https://drive.google.com/file/d/${result.id}/view`;
        upload.folderLink =
          `https://drive.google.com/drive/folders/${upload.folderId}`;
        upload.uploadStatus = "completed";
        await upload.save();
        break;
      }
      case "media":
        break;
      case "multipart":
        break;
    }
  },
});

googleUploadEntry.addHook("beforeInsert", {
  label: "Validate File Path",
  action(upload) {
    const filePath =
      `${upload.orm.app.config.appRootPath}/files/${upload.filePath}`;

    if (!filePath) {
      raiseEasyException("File path is required", 400);
    }
    try {
      Deno.statSync(filePath);
    } catch (error) {
      raiseEasyException(`File not found: ${filePath}`, 400);
    }
    upload.systemPath = filePath;
  },
});

googleUploadEntry.addHook("beforeInsert", {
  label: "Set File Metadata",
  action(upload) {
    if (!upload.systemPath) {
      return;
    }
    const fileName = upload.systemPath.split("/").pop() || "";
    const fileMimeType = getMimeType(fileName);
    upload.fileName = fileName;
    upload.fileMimeType = fileMimeType;
    upload.fileSize = formatFileSize(Deno.statSync(upload.systemPath).size);
  },
});

googleUploadEntry.addAction("createSessionUri", {
  label: "Create Upload Session",
  async action(upload) {
    const { orm } = upload;
    if (!upload.fileName || !upload.fileMimeType) {
      raiseEasyException("File name and mime type are required", 400);
    }
    const googleSettings = await orm.getSettings("googleSettings");
    const sessionUri = await createUploadSession(orm, {
      fileName: upload.fileName,
      folderId: googleSettings.dbBackupFolderId,
      mimeType: upload.fileMimeType,
    });

    if (!sessionUri) {
      throw new Error("Failed to create upload session");
    }
    upload.sessionUri = sessionUri;
    upload.uploadStatus = "inProgress";
    upload.folderId = googleSettings.dbBackupFolderId;
    upload.save();
  },
});

function formatFileSize(size: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  while (size > 1024) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function getMimeType(fileName: string) {
  const ext = fileName.split(".").pop() || "";
  return mimeTypeMap[ext as keyof typeof mimeTypeMap] ||
    "application/octet-stream";
}

const mimeTypeMap = {
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "png": "image/png",
  "gif": "image/gif",
  "pdf": "application/pdf",
  "doc": "application/msword",
  "docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "xls": "application/vnd.ms-excel",
  "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "ppt": "application/vnd.ms-powerpoint",
  "pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "txt": "text/plain",
  "rtf": "application/rtf",
  "html": "text/html",
  "htm": "text/html",
  "zip": "application/zip",
  "rar": "application/x-rar-compressed",
  "tar": "application/x-tar",
  "gz": "application/gzip",
  "7z": "application/x-7z-compressed",
  "mp3": "audio/mpeg",
  "wav": "audio/wav",
  "ogg": "audio/ogg",
  "mp4": "video/mp4",
};
