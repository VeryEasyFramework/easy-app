import { createAction } from "#/actions/createAction.ts";
import type { PackageInfo } from "#/package/easyPackage.ts";
import type { SocketRoomDef } from "#/realtime/realtimeServer.ts";
import type { DocsActionGroup } from "#/actions/actionTypes.ts";
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
  createAction("apiTypes", {
    description: "Get the types for the app",
    action: (app): string => {
      return app.requestTypes;
    },
    response: "string",
  }),
  createAction("listRooms", {
    description: "List all realtime rooms",
    action: (app): Array<SocketRoomDef> => {
      return app.realtime.info.rooms;
    },
    response: "Array<SocketRoomDef>",
  }),
  createAction("listPackages", {
    description: "List all packages",
    action: (app): PackageInfo[] => {
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
