import { InputListener, MenuView } from "@vef/easy-cli";
import { EasyApp } from "#/easyApp.ts";
import { cli } from "#/package/basePack/boot/cli/cli.ts";
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
  const abortController = new AbortController();
  const signal = abortController.signal;
  const listener = new InputListener({
    abortController,
    hideCursor: true,
  });
  runMenu.addAction({
    name: "Development",
    description: "Run the app in development mode",
    action: () => {
      cli.stop();

      listener.listen();
      signal.addEventListener("abort", (event) => {
        app.stop();
        Deno.exit();
      });
      app.stop();
      app.startProcess();
    },
  });

  runMenu.addAction({
    name: "Development Watch",
    description: "Run the app in development mode with a file watcher",
    action: () => {
      cli.stop();

      listener.listen();
      signal.addEventListener("abort", (event) => {
        app.stop();
        Deno.exit();
      });
      app.stop();
      app.startProcess({
        flags: ["--watch"],
      });
    },
  });

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
        flags: ["--prod"],
      });
    },
  });
}
