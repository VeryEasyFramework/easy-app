import type { InitAction } from "#/types.ts";
import { EasyCli } from "@vef/easy-cli";
import { setupMainMenu } from "#/package/basePack/init/cli/menus/mainMenu.ts";
import { setupGroupsMenu } from "#/package/basePack/init/cli/menus/groupsMenu.ts";
import { setupRunMenu } from "#/package/basePack/init/cli/menus/runMenu.ts";
import {
  setupReleaseView,
} from "#/package/basePack/init/cli/views/buildReleaseView.ts";
import { setupDbMenu } from "#/package/basePack/init/cli/menus/databaseMenu.ts";
import {
  setupMigrateDbView,
} from "#/package/basePack/init/cli/views/migrateDbView.ts";
import { setupGetDevUi } from "#/package/basePack/init/cli/views/getDevUiView.ts";

export const buildCli: InitAction = {
  actionName: "buildCli",
  description: "Build the CLI for the app",
  action(app) {
    app.cli = new EasyCli({
      theme: {
        backgroundColor: "bgBlack",
        primaryColor: "brightCyan",
      },
    });

    app.cli.appName = app.config.appName;
    setupReleaseView(app);
    setupGetDevUi(app);
    setupMigrateDbView(app);
    setupRunMenu(app);
    setupMainMenu(app);
    setupGroupsMenu(app);
    setupDbMenu(app);
  },
};
