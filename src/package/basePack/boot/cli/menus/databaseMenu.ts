import { MenuView } from "@vef/easy-cli";
import type { EasyApp } from "#/easyApp.ts";
import { cli } from "#/package/basePack/boot/cli/cli.ts";
export const dbMenu = new MenuView({
  clock: true,
  title: "Database Ops",
  description: "Various database related operations",
});

export function setupDbMenu(app: EasyApp) {
  dbMenu.setExitAction({
    name: "Back",
    description: "Go back to the main menu",
    action: () => {
      cli.changeView("main");
    },
  });

  dbMenu.addAction({
    name: "Migrate Database",
    description: "Migrate the database",
    action: () => {
      cli.changeView("migrateDb");
    },
  });
}
