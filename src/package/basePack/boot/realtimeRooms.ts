import type { BootAction } from "#/types.ts";
import type { RealtimeRoomDef } from "#/realtime/realtimeTypes.ts";
export const bootEntityRooms: BootAction = {
  actionName: "bootEntityRooms",
  description: "Create realtime rooms for each entity",
  action(app) {
    const entities = app.orm.entityInfo;
    const rooms: RealtimeRoomDef[] = [];
    for (const entity of entities) {
      rooms.push({
        roomName: `entity:${entity.entityId}`,
        description: `Realtime room for the ${entity.label} entity`,
        events: ["create", "update", "delete", "list"],
      });
    }
    app.addRealtimeRooms(rooms);
  },
};
