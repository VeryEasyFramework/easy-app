import { EasyPack } from "#/package/easyPack.ts";
import { appActions } from "#/package/basePack/actions/appActions.ts";

import { entityActions } from "#/package/basePack/actions/entityActions.ts";
import { bootEntityRooms } from "#/package/basePack/boot/realtimeRooms.ts";
const basePackage = new EasyPack("base", {
  description:
    "This is the base package for EasyApp. It includes basic actions for interacting with entities and the app itself.",
});

basePackage.addActionGroup("app", appActions);
basePackage.addActionGroup("entity", entityActions);

basePackage.addRealtimeRoom({
  roomName: "entity",
  events: ["create", "update", "delete"],
});
basePackage.addRealtimeRoom({
  roomName: "app",
  events: ["announce"],
});

basePackage.setVersion(0, 1, 0);
basePackage.addBootAction(bootEntityRooms);

export { basePackage };
