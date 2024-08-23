import { MenuView } from "@vef/easy-cli";
import { cli } from "#/package/basePack/boot/cli/cli.ts";
import { EasyApp } from "#/easyApp.ts";
import { InputListener, printUtils } from "@vef/easy-cli";
import { releaseView } from "#/package/basePack/boot/cli/views/buildReleaseView.ts";

export const mainMenu = new MenuView(
  {
    title: "Main Menu",
    description: "Welcome to the EasyApp CLI",
    clock: true,
  },
);

mainMenu.addAction({
  name: "App Actions",
  description: "Select an action in the app",
  action: () => {
    cli.changeView("groups");
  },
});

export function setupMainMenu(app: EasyApp) {
  mainMenu.setExitAction({
    name: "Exit",
    description: "Exit the CLI",
    action: () => {
      cli.stop();
      app.stop();
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
    name: "Build Release",
    description: "Build a release of the app",
    action: () => {
      cli.changeView("release");
      releaseView.start();
    },
  });
}
