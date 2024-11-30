import type { BootAction } from "#/types.ts";
import type { RealtimeRoomDef } from "#/realtime/realtimeTypes.ts";

export const bootEntryRooms: BootAction = {
  actionName: "bootEntryRooms",
  description: "Create realtime rooms for each entry type",
  action(app) {
    const entryTypes = app.orm.entryTypes;
    const rooms: RealtimeRoomDef[] = [];
    for (const entryType of Object.values(entryTypes)) {
      rooms.push({
        roomName: `entryType:${entryType.entryType}`,
        description:
          `Realtime room for the ${entryType.config.label} entry type`,
      });
    }
    app.addRealtimeRooms(rooms);
  },
};
