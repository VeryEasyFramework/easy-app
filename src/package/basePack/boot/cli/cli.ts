import { BootAction } from "#/types.ts";
import { ColorMe, EasyCli, MenuView, TaskView } from "@vef/easy-cli";
import { camelToTitleCase } from "@vef/string-utils";
import { EasyResponse } from "#/easyResponse.ts";
import {
  mainMenu,
  setupMainMenu,
} from "#/package/basePack/boot/cli/menus/mainMenu.ts";
import {
  groupsMenu,
  setupGroupsMenu,
} from "#/package/basePack/boot/cli/menus/groupsMenu.ts";
import {
  runMenu,
  setupRunMenu,
} from "#/package/basePack/boot/cli/menus/runMenu.ts";
import { releaseView } from "#/package/basePack/boot/cli/views/buildReleaseView.ts";
export const cli = new EasyCli({
  theme: {
    backgroundColor: "bgBlack",
    primaryColor: "brightCyan",
  },
});

cli.addView(mainMenu, "main");
cli.addView(groupsMenu, "groups");
cli.addView(runMenu, "run");
cli.addView(releaseView, "release");
export const buildCli: BootAction = {
  actionName: "buildCli",
  description: "Build the CLI for the app",
  action(app) {
    const name = app.config.appName;
    cli.appName = name;
    setupMainMenu(app);
    setupRunMenu(app);
    setupGroupsMenu(app);
    app.cli = cli;
  },
};