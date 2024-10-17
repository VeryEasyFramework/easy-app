import { InputListener, MenuView } from "@vef/easy-cli";
import {
  type BasicFgColor,
  ColorMe,
  formatUtils,
  printUtils,
} from "@vef/easy-cli";

import type { EasyApp } from "#/app/easyApp.ts";
import { asyncPause, checkForFile } from "#/utils.ts";
import begin from "#/app/runner/begin.ts";

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
        app.cli.onStop = () => {
          begin({
            multiProcess: app.config.multiProcessing,
            args: [],
            signal,
          });
          listener.listen();
          signal.addEventListener("abort", async (event) => {
            await asyncPause(1000);
            Deno.exit();
          });
        };
        app.cli.stop();
      },
    });

    runMenu.addAction({
      name: "Development Watch",
      description: "Run the app in development mode with a file watcher",
      action: () => {
        app.cli.onStop = () => {
          begin({
            multiProcess: app.config.multiProcessing,
            args: [],
            flags: ["--watch"],
            signal,
          });
          listener.listen();
          signal.addEventListener("abort", async (event) => {
            await asyncPause(1000);
            Deno.exit();
          });
        };
        app.cli.stop();
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
        app.cli.onStop = () => {
          begin({
            multiProcess: app.config.multiProcessing,
            args: ["--prod"],
            signal,
          });
          listener.listen();
          signal.addEventListener("abort", async (event) => {
            await asyncPause(1000);
            Deno.exit();
          });
        };
        app.cli.stop();
      },
    });
  }
}
