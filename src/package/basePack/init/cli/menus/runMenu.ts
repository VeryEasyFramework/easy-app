import { InputListener, MenuView } from "@vef/easy-cli";

import type { EasyApp } from "#/app/easyApp.ts";
import { checkForFile } from "#/utils.ts";
import begin from "#/app/runner/begin.ts";
import { easyLog } from "#/log/logging.ts";

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
    captureMouse: false,
  });
  const run = (watch: boolean, prod?: boolean) => {
    app.cli.onStop = async () => {
      listener.listen();

      const procs = await begin({
        multiProcess: app.config.multiProcessing,
        flags: watch ? ["--watch"] : [],
        app,
      });
      app.processes.push(...procs);
    };
    app.cli.stop();
  };
  signal.addEventListener("abort", (event) => {
    listener.stop();
    easyLog.warning("Shutting down...", "Lifecycle", {
      hideTrace: true,
    });
    app.exit(0);
  });
  if (dev) {
    runMenu.addAction({
      name: "Development",
      description: "Run the app in development mode",
      action: () => {
        run(false);
      },
    });

    runMenu.addAction({
      name: "Development Watch",
      description: "Run the app in development mode with a file watcher",
      action: () => {
        run(true);
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
        run(false, true);
      },
    });
  }
}
