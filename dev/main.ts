import { createAction } from "#/actions/createAction.ts";
import { app } from "./app.ts";
app.mainModule = import.meta.url;

app.addAction(
  "test",
  createAction("test", {
    description: "Test action",
    action(app) {
      app.notify("test", "test", {
        message: "Hello World",
      });
      return {
        message: "done",
      };
    },
  }),
);
if (import.meta.main) {
  await app.run();
}
