import { InputListener, MenuView } from "@vef/easy-cli";
import type { EasyApp } from "#/app/easyApp.ts";
import { asyncPause, checkForFile } from "#/utils.ts";

export function setupRunMenu(app: EasyApp): void {
  const runMenu = new MenuView({
    clock: true,
    title: "Run the app",
    description: "Select a mode to run the app",
  });

  runMenu.setExitAction({
    name: "Back",
    description: "Go back to the main menu",
    action: () => {
      app.cli.changeView("main");
    },
  });

  app.cli.addView(runMenu, "run");
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
        app.cli.stop();

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
        app.cli.stop();

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
      prodBinary = "appOsx";
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
        app.cli.stop();

        app.begin({
          args: ["--prod"],
          signal,
        });
        listener.listen();
        signal.addEventListener("abort", async (event) => {
          await asyncPause(1000);
          Deno.exit();
        });
      },
    });
  }
}
