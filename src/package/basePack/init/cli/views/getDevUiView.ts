import { TaskView } from "@vef/easy-cli";
import type { EasyApp } from "#/app/easyApp.ts";

export function setupGetDevUi(app: EasyApp): void {
  const getDevUiView = new TaskView({
    title: "Get Dev UI",
    description: "Download the Dev UI for the app",
    clock: true,
  });

  getDevUiView.addTask("Download Dev UI", {
    messages: {
      pending: "Waiting to start the download",
      running: "Downloading the Dev UI",
      failed: "Failed to download the Dev UI",
      done: "Downloaded the Dev UI successfully",
    },
    action: async ({ fail, output, success }) => {
      const url =
        "github.com/VeryEasyFramework/easy-app-template/releases/download/0.0.1-alpha/dev-ui.zip";

      const response = await fetch(`https://${url}`);
      if (!response.ok) {
        output(`Failed to download the Dev UI: ${response.statusText}`);
        fail();
      }

      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      const data = new Uint8Array(buffer);
      output("Downloaded the Dev UI");
      await Deno.writeFile("dev-ui.zip", data);
      output("Downloaded the Dev UI successfully");
      success();
    },
  });
  app.cli.addView(getDevUiView, "getDevUi");
}
