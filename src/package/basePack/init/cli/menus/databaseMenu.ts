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

  dbMenu.addAction({
    name: "Generate Types",
    description: "Generate entry type typescript interfaces",
    action: () => {
      app.cli.changeView("generateTypes");
    },
  });

  dbMenu.addAction({
    name: "Get Pg Memory Settings",
    description: "Get the recommended memory settings for Postgres",
    action: () => {
      app.cli.changeView("pgMemory");
    },
  });
  app.cli.addView(dbMenu, "database");
}
