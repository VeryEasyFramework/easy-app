import type { EasyApp } from "#/app/easyApp.ts";
import { TaskView } from "@vef/easy-cli";
import { calculateMemorySettings } from "#orm/database/adapter/adapters/postgres/pgUtils.ts";

export function setupPgMemoryView(app: EasyApp) {
  const pgMemoryView = new TaskView({
    title: "Get Pg Memory Settings",
    description: "Get the recommended memory settings for Postgres",
    clock: true,
  });

  pgMemoryView.addTask("Get", {
    action({
      fail,
      output,
      success,
    }) {
      output("Getting memory settings...");
      try {
        const settings = calculateMemorySettings();
        output(JSON.stringify(settings, null, 2).split("\n"));
        success();
      } catch (e: unknown) {
        output(`Error getting memory settings: ${e}`);
        fail();
      }
    },
  });

  pgMemoryView.onDone(() => {
    pgMemoryView.cli.changeView("main");
  });

  app.cli.addView(pgMemoryView, "pgMemory");
}
