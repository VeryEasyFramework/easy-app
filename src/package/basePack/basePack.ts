import { EasyPack } from "#/package/easyPack.ts";
import { appActions } from "#/package/basePack/actions/appActions.ts";
import { bootEntryRooms } from "#/package/basePack/boot/realtimeRooms.ts";
import { entryActions } from "#/package/basePack/actions/entryActions/index.ts";
import {
  requestOptionsMiddleware,
} from "#/package/basePack/middleware/requestOptionsMiddleware.ts";
import { buildCli } from "#/package/basePack/init/cli/cli.ts";
import { editLogEntry } from "#/package/basePack/entryTypes/editLogEntry.ts";
import { ormGlobalHooks } from "#/package/basePack/boot/ormGlobalHooks.ts";
import { settingsActions } from "#/package/basePack/actions/settingsActions/index.ts";

const basePack = new EasyPack("base", {
  description:
    "This is the base package for EasyApp. It includes basic actions for interacting with entries and the app itself.",
});

basePack.addActionGroup("app", appActions);
basePack.addActionGroup("entry", entryActions);
basePack.addActionGroup("settings", settingsActions);

basePack.addRealtimeRoom({
  roomName: "broadcast",
});

basePack.addMiddleware(requestOptionsMiddleware);

basePack.addEntryType(editLogEntry);

basePack.setVersion(0, 1, 0);
basePack.addBootAction(bootEntryRooms);
basePack.addBootAction(ormGlobalHooks);
basePack.addInitAction(buildCli);

export { basePack };
