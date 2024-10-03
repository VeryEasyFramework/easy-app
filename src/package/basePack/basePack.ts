import { EasyPack } from "#/package/easyPack.ts";
import { appActions } from "#/package/basePack/actions/appActions.ts";
import { bootEntityRooms } from "#/package/basePack/boot/realtimeRooms.ts";
import { entityActions } from "#/package/basePack/actions/entityActions/index.ts";
import { requestOptionsMiddleware } from "#/package/basePack/middleware/requestOptionsMiddleware.ts";
import { buildCli } from "#/package/basePack/init/cli/cli.ts";
import { editLogEntity } from "#/package/basePack/entities/editLogEntity.ts";
import { ormGlobalHooks } from "#/package/basePack/boot/ormGlobalHooks.ts";

const basePack = new EasyPack("base", {
  description:
    "This is the base package for EasyApp. It includes basic actions for interacting with entities and the app itself.",
});

basePack.addActionGroup("app", appActions);
basePack.addActionGroup("entity", entityActions);

basePack.addRealtimeRoom({
  roomName: "app",
  events: ["announce"],
});

basePack.addMiddleware(requestOptionsMiddleware);

basePack.addEntity(editLogEntity);

basePack.setVersion(0, 1, 0);
basePack.addBootAction(bootEntityRooms);
basePack.addBootAction(ormGlobalHooks);
basePack.addInitAction(buildCli);

export { basePack };
