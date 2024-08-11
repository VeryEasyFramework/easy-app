import { EasyApp } from "../mod.ts";
import { authPackage } from "#/package/authPackage/authPackage.ts";

const app = new EasyApp();
app.addPackage(authPackage);
app.run({
  clientProxyPort: 5174,
});
