import { createAction } from "#/actions/createAction.ts";
import type { EasyPackInfo } from "#/package/easyPack.ts";
import type { RealtimeRoomDef } from "#/realtime/realtimeTypes.ts";
import type { DocsActionGroup } from "#/actions/actionTypes.ts";
import type { EntryType as EntryTypeDef } from "@vef/types";

export const appActions = [
  createAction("apiDocs", {
    description: "Get the API information for the app",
    action: (app): DocsActionGroup[] => {
      const fullDocs: DocsActionGroup[] = [];
      for (const groupKey in app.actions) {
        const groupDocs = app.getActionGroupDocs(groupKey);
        fullDocs.push(groupDocs);
      }
      return fullDocs;
    },
    response: "DocsActionGroup[]",
  }),

  createAction("listRooms", {
    description: "List all realtime rooms",
    action: (app): Array<RealtimeRoomDef> => {
      return app.realtime.info.rooms;
    },
    response: "Array<SocketRoomDef>",
  }),
  createAction("listPackages", {
    description: "List all packages",
    action: (app): EasyPackInfo[] => {
      return app.packages;
    },
    response: "PackageInfo[]",
  }),
  createAction("status", {
    description: "Get the status of the app",
    action: (app): string => {
      return "alive and well!";
    },
    response: "string",
  }),
  createAction("getCache", {
    description: "Get the cache",
    action: (app) => {
      return app.cache.getAll();
    },
  }),
  createAction("entryTypes", {
    description: "Get the entryTypes for the app",
    action: (app): EntryTypeDef[] => {
      return app.entryTypeInfo;
    },
    response: "EntryTypeDef[]",
  }),

  createAction("settingsTypes", {
    description: "Get the settings types for the app",
    action(app) {
      return app.settingsTypeInfo;
    },
    response: "SettingsType[]",
  }),

  createAction("notify", {
    description: "Send a realtime notification",
    action: (app, { room, event, data }) => {
      app.notify(room, event, data);
      return "Notification sent";
    },
    params: {
      room: {
        required: true,
        type: "DataField",
      },
      event: {
        required: true,
        type: "DataField",
      },
      data: {
        required: true,
        type: "JSONField",
      },
    },
  }),
];
