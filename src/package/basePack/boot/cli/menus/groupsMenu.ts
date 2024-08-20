import { ColorMe, MenuView } from "@vef/easy-cli";
import { cli } from "#/package/basePack/boot/cli/cli.ts";

export const groupsMenu = new MenuView({
  title: "App Actions",
  description: `Select an ${
    ColorMe.standard().content("Action Group").color("brightMagenta").end()
  } in the app`,
  clock: true,
});

groupsMenu.setExitAction({
  name: "Back",
  description: "Go back to the main menu",
  action: () => {
    cli.changeView("main");
  },
});
