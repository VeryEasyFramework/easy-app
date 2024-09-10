import { EasyApp } from "#/easyApp.ts";
import { authPack } from "#/package/authPackage/authPack.ts";

const app = new EasyApp();
authPack.addAction({
   groupName: "test",
   actionName: "cacheSet",
   action(app) {
      app.cacheSet("user", "1", { name: "John" });
      app.cacheSet("user", "2", { name: "Jane" });
   },
   description: "Test cache",
});

authPack.addAction({
   groupName: "test",
   actionName: "cacheGetList",
   action(app) {
      return app.cacheGetList("user");
   },
   description: "Test cache",
});

app.addEasyPack(authPack);

app.run();
