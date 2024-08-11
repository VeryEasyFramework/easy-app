import { EasyApp } from "../mod.ts";
import { authPackage } from "../src/package/authPackage/authPack.ts";
import { EasyPack } from "../src/package/easyPack.ts";

const packagee = new EasyPack("myPackage");

const app = new EasyApp();
app.addPackage(authPackage);
app.run({
  clientProxyPort: 5174,
});
