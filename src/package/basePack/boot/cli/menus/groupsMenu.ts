import { ColorMe, MenuView, TaskView } from "@vef/easy-cli";
import { cli } from "#/package/basePack/boot/cli/cli.ts";
import { EasyApp } from "#/easyApp.ts";
import { camelToTitleCase } from "@vef/string-utils";
import { EasyResponse } from "#/easyResponse.ts";
import { EasyRequest } from "#/easyRequest.ts";

export const groupsMenu = new MenuView({
  title: "App Actions",
  description: `Select an ${
    ColorMe.standard().content("Action Group").color("brightMagenta").end()
  } in the app`,
  clock: true,
});

groupsMenu.setExitAction({
  name: "Back",
  description: "Go back to the main menu",
  action: () => {
    cli.changeView("main");
  },
});

export function setupGroupsMenu(app: EasyApp) {
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
            new EasyRequest(new Request("http://localhost")),
            new EasyResponse(),
          );
          if (typeof response === "string") {
            output(response);
          } else if (Array.isArray(response)) {
            const responseLines: string[] = [];
            const json = JSON.stringify(response, null, 2);
            json.split("\n").forEach((line) => {
              responseLines.push(line);
            });
            output(responseLines);
          }

          success();
          actionView.done();
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
}
