import { EasyPackage } from "#/package/easyPackage.ts";
import { appActions } from "./actions/appActions.ts";

import { entityActions } from "./actions/entityActions.ts";
const basePackage = new EasyPackage("base", {
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
export { basePackage };
