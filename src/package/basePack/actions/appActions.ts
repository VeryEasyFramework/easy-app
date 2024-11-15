import { createAction } from "#/actions/createAction.ts";
import type { EasyPackInfo } from "#/package/easyPack.ts";
import type { RealtimeRoomDef } from "#/realtime/realtimeTypes.ts";
import type { DocsActionGroup } from "#/actions/actionTypes.ts";
import type { EntryTypeDef } from "@vef/types";

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
  createAction("entities", {
    description: "Get the entities for the app",
    action: (app): EntryTypeDef[] => {
      return app.entityInfo;
    },
    response: "EntityDefinition[]",
  }),

  createAction("settings", {
    description: "Get the settings definitions for the app",
    action(app) {
      return app.settingsInfo;
    },
    response: "SettingsEntityDefinition[]",
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
