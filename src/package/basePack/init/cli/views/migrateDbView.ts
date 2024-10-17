import { ColorMe, TaskView } from "@vef/easy-cli";
import type { EasyApp } from "#/app/easyApp.ts";
export function setupMigrateDbView(app: EasyApp): void {
  const migrateDbView = new TaskView({
    title: "Migrate Database",
    description: "Migrate the database",
    clock: true,
  });

  migrateDbView.addTask("Migrate", {
    async action({
      fail,
      output,
      progress,
      success,
    }) {
      output("Migrating database...");
      try {
        const results = await app.orm.migrate({
          onProgress: (progressValue, total, message) => {
            output(`${progressValue}/${total} ${message}`);
          },
        });
        output(
          ColorMe.standard().content("Database migrated").color("green")
            .end(),
        );

        output(results);

        success();
      } catch (e: unknown) {
        let message = "Error migrating database: ";
        if (e instanceof Error) {
          message += e.message;
        }
        output(`Error migrating database: ${message}`);
        fail();
      }
    },
  });
  migrateDbView.onDone(() => {
    migrateDbView.cli.changeView("main");
  });

  app.cli.addView(migrateDbView, "migrateDb");
}
