import { BootAction } from "#/types.ts";
import { ColorMe, EasyCli, MenuView, TaskView } from "@vef/easy-cli";
import { camelToTitleCase } from "@vef/string-utils";
import { EasyResponse } from "#/easyResponse.ts";
import { mainMenu } from "#/package/basePack/boot/cli/menus/mainMenu.ts";
import { groupsMenu } from "#/package/basePack/boot/cli/menus/groupsMenu.ts";
export const cli = new EasyCli({
  theme: {
    backgroundColor: "bgBlack",
    primaryColor: "brightCyan",
  },
});

cli.addView(mainMenu, "main");
cli.addView(groupsMenu, "groups");
export const buildCli: BootAction = {
  actionName: "buildCli",
  description: "Build the CLI for the app",
  action(app) {
    const name = app.config.appName;
    cli.appName = name;

    for (const group in app.actions) {
      groupsMenu.addAction({
        name: camelToTitleCase(group),
        description: `Select an action in the ${group} group`,
        action: () => {
          cli.changeView(group);
        },
      });
      const groupMenu = new MenuView(
        {
          title: camelToTitleCase(group),
          description: `Select an action in the ${group} group`,
          clock: true,
        },
      );
      groupMenu.setExitAction({
        name: "Back",
        description: "Go back to App Actions",
        action: () => {
          cli.changeView("groups");
        },
      });
      for (const action in app.actions[group]) {
        const actionData = app.actions[group][action];
        const actionView = new TaskView();
        actionView.onDone(() => {
          cli.changeView(group);
        });
        actionView.addTask("Run Action", {
          action: async ({ fail, output, success }) => {
            const response = await actionData.action(
              app,
              {},
              new EasyResponse(),
            );
            if (typeof response === "string") {
              output(response);
            } else {
              const responseLines: string[] = [];
              const json = JSON.stringify(response, null, 2);
              json.split("\n").forEach((line) => {
                responseLines.push(line);
              });
              output(responseLines);
              success();
              actionView.done();
            }
          },
          style: "moon",
        });
        cli.addView(actionView, `${group}:${action}`);

        groupMenu.addAction({
          name: camelToTitleCase(action),
          description: actionData.description,
          action: () => {
            cli.changeView(`${group}:${action}`);
            actionView.start();
          },
        });
      }
      cli.addView(groupMenu, group);
    }
    app.cli = cli;
  },
};
