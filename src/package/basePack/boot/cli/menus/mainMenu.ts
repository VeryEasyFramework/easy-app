import { MenuView } from "@vef/easy-cli";
import { cli } from "#/package/basePack/boot/cli/cli.ts";
import { EasyApp } from "#/easyApp.ts";
import { releaseView } from "#/package/basePack/boot/cli/views/buildReleaseView.ts";
import { checkForFile } from "#/utils.ts";

export const mainMenu = new MenuView(
  {
    title: "Main Menu",
    description: "Welcome to the EasyApp CLI",
    clock: true,
  },
);

export function setupMainMenu(app: EasyApp) {
  mainMenu.setExitAction({
    name: "Exit",
    description: "Exit the CLI",
    action: () => {
      cli.stop();
      app.stop();
      console.clear();
      Deno.exit();
    },
  });

  mainMenu.addAction({
    name: "Run",
    description: "Run the app",
    action: () => {
      cli.changeView("run");
    },
  });

  mainMenu.addAction({
    name: "App Actions",
    description: "Select an action in the app",
    action: () => {
      cli.changeView("groups");
    },
  });
  mainMenu.addAction({
    name: "Database Ops",
    description: "Various database related operations",
    action: () => {
      cli.changeView("database");
    },
  });
  const dev = checkForFile("main.ts");
  if (dev) {
    mainMenu.addAction({
      name: "Build Release",
      description: "Build a release of the app",
      action: () => {
        cli.changeView("release");
        releaseView.start();
      },
    });
    mainMenu.addAction({
      name: "Get Dev UI",
      description: "Download the Dev UI for the app",
      action: () => {
        cli.changeView("getDevUi");
      },
    });
  }
}
