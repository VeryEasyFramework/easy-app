import { EasyApp } from "../mod.ts";
import { createAction } from "#/createAction.ts";

const check = createAction("check", {
  description: "Check if the server is running",
  action: async (app) => {
    return { message: "Server is running" };
  },
});

const app = new EasyApp({
  appRootPath: "dev",
  staticFileRoot: "public",
  singlePageApp: false,
});

app.addAction("auth", check);
app.run();
