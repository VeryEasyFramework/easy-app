import { InputListener, MenuView } from "@vef/easy-cli";
import { EasyApp } from "#/easyApp.ts";
import { cli } from "#/package/basePack/boot/cli/cli.ts";
import { asyncPause, checkForFile } from "#/utils.ts";
export const runMenu = new MenuView({
  clock: true,
  title: "Run the app",
  description: "Select a mode to run the app",
});

runMenu.setExitAction({
  name: "Back",
  description: "Go back to the main menu",
  action: () => {
    cli.changeView("main");
  },
});

export function setupRunMenu(app: EasyApp) {
  const dev = checkForFile("main.ts");
  const abortController = new AbortController();
  const signal = abortController.signal;
  const listener = new InputListener({
    abortController,
    hideCursor: true,
  });
  if (dev) {
    runMenu.addAction({
      name: "Development",
      description: "Run the app in development mode",
      action: () => {
        cli.stop();

        app.begin({
          args: [],
          signal,
        });
        listener.listen();
        signal.addEventListener("abort", async (event) => {
          await asyncPause(1000);
          Deno.exit();
        });
      },
    });

    runMenu.addAction({
      name: "Development Watch",
      description: "Run the app in development mode with a file watcher",
      action: () => {
        cli.stop();

        app.begin({
          args: [],
          flags: ["--watch"],
          signal,
        });
        listener.listen();
        signal.addEventListener("abort", async (event) => {
          await asyncPause(1000);
          Deno.exit();
        });
      },
    });
    return;
  }
  const platform = Deno.build.os;
  let prodBinary = "app";
  switch (platform) {
    case "windows":
      prodBinary = "app.exe";
      break;
    case "darwin":
      prodBinary = "app";
      break;
    default:
      prodBinary = "app";
      break;
  }

  if (checkForFile(prodBinary)) {
    runMenu.addAction({
      name: "Production",
      description: "Run the app in production mode",
      action: () => {
        cli.stop();

        listener.listen();
        signal.addEventListener("abort", (event) => {
          app.stop();
          Deno.exit();
        });
        app.stop();

        app.startProcess({
          args: ["serve", "--prod"],
        });
      },
    });
  }
}
