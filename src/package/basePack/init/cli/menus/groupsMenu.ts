import { ColorMe, MenuView, TaskView } from "@vef/easy-cli";
import type { EasyApp } from "#/app/easyApp.ts";
import { camelToTitleCase } from "@vef/string-utils";
import { EasyResponse } from "#/app/easyResponse.ts";
import { EasyRequest } from "#/app/easyRequest.ts";

export function setupGroupsMenu(app: EasyApp): void {
  const groupsMenu = new MenuView({
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
      app.cli.changeView("main");
    },
  });
  for (const group in app.actions) {
    groupsMenu.addAction({
      name: camelToTitleCase(group),
      description: `Select an action in the ${group} group`,
      action: () => {
        app.cli.changeView(group);
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
        app.cli.changeView("groups");
      },
    });
    for (const action in app.actions[group]) {
      const actionData = app.actions[group][action];
      const actionView = new TaskView();
      actionView.onDone(() => {
        app.cli.changeView(group);
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
      app.cli.addView(actionView, `${group}:${action}`);

      groupMenu.addAction({
        name: camelToTitleCase(action),
        description: actionData.description,
        action: () => {
          app.cli.changeView(`${group}:${action}`);
          actionView.start();
        },
      });
    }
    app.cli.addView(groupMenu, group);
  }
  app.cli.addView(groupsMenu, "groups");
}
