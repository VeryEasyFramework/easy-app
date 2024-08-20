import { MenuView } from "@vef/easy-cli";
import { cli } from "#/package/basePack/boot/cli/cli.ts";

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
