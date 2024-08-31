import { EasyApp } from "#/easyApp.ts";
import { authPack } from "#/package/authPackage/authPack.ts";

const app = new EasyApp({
  appName: "easy-app",
  ormOptions: {
    databaseType: "postgres",
    databaseConfig: {
      size: 1,
      camelCase: true,
      clientOptions: {
        database: "easyapp",
        user: "postgres",
        password: "postgres",
        camelCase: true,
        host: "localhost",
        port: 5432,
      },
    },
  },
});
app.addEasyPack(authPack);
app.run();
