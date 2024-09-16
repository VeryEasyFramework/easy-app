import { MenuView } from "@vef/easy-cli";
import type { EasyApp } from "#/easyApp.ts";
import { checkForFile } from "#/utils.ts";

export function setupMainMenu(app: EasyApp): void {
  const mainMenu = new MenuView(
    {
      title: "Main Menu",
      description: "Welcome to the EasyApp CLI",
      clock: true,
    },
  );
  mainMenu.setExitAction({
    name: "Exit",
    description: "Exit the CLI",
    action: () => {
      app.cli.stop();
      app.stop();
      console.clear();
      Deno.exit();
    },
  });

  mainMenu.addAction({
    name: "Run",
    description: "Run the app",
    action: () => {
      app.cli.changeView("run");
    },
  });

  mainMenu.addAction({
    name: "App Actions",
    description: "Select an action in the app",
    action: () => {
      app.cli.changeView("groups");
    },
  });
  mainMenu.addAction({
    name: "Database Ops",
    description: "Various database related operations",
    action: () => {
      app.cli.changeView("database");
    },
  });
  const dev = checkForFile("main.ts");
  if (dev) {
    if (Deno.build.os === "linux" || Deno.build.os === "darwin") {
      mainMenu.addAction({
        name: "Build Release",
        description: "Build a release of the app",
        action: () => {
          app.cli.changeView("release");
        },
      });
    }
    mainMenu.addAction({
      name: "Get Dev UI",
      description: "Download the Dev UI for the app",
      action: () => {
        app.cli.changeView("getDevUi");
      },
    });
  }

  app.cli.addView(mainMenu, "main");
  app.cliMenu = mainMenu;
  app.cli.mainMenu = mainMenu;
}
