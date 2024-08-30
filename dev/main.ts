import { createAction } from "#/actions/createAction.ts";
import { EasyApp } from "#/easyApp.ts";
import { defineEntity } from "@vef/easy-orm";
import { authPack } from "#/package/authPackage/authPack.ts";
const app = new EasyApp({
  serverOptions: {
    port: 8000,
    reusePort: true,
  },
  ormOptions: {
    databaseType: "postgres",
    databaseConfig: {
      camelCase: true,
      host: "localhost",
      port: 5432,
      size: 1,
      clientOptions: {
        database: "easyapp",
        user: "postgres",
        camelCase: true,
        password: "postgres",
        host: "localhost",
        port: 5432,
      },
    },
    idFieldType: "IDField",
  },
});
app.addEasyPack(authPack);

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
