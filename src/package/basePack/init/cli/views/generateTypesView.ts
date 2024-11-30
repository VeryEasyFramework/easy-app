import { ColorMe, TaskView } from "@vef/easy-cli";
import type { EasyApp } from "#/app/easyApp.ts";

export function setupGenerateTypesView(app: EasyApp): void {
  const generateTypesView = new TaskView({
    title: "Generate Types",
    description: "Generate typescript interfaces for entry types",
    clock: true,
  });
  generateTypesView.addTask("Generate", {
    action({
      output,
      success,
    }) {
      output("Generating types...");
      app.orm.generateTypes();
      output(
        ColorMe.standard().content("Types generated").color("green").end(),
      );
      success();
    },
  });

  app.cli.addView(generateTypesView, "generateTypes");
}
