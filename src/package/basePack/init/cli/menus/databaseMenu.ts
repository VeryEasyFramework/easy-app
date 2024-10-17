import { MenuView } from "@vef/easy-cli";
import type { EasyApp } from "#/app/easyApp.ts";

export function setupDbMenu(app: EasyApp): void {
   const dbMenu = new MenuView({
      clock: true,
      title: "Database Ops",
      description: "Various database related operations",
   });

   dbMenu.setExitAction({
      name: "Back",
      description: "Go back to the main menu",
      action: () => {
         app.cli.changeView("main");
      },
   });

   dbMenu.addAction({
      name: "Migrate Database",
      description: "Migrate the database",
      action: () => {
         app.cli.changeView("migrateDb");
      },
   });
   app.cli.addView(dbMenu, "database");
}
