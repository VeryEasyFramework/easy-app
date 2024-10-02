import { EasyApp } from "#/easyApp.ts";
import { authPack } from "#/package/authPack/authPack.ts";

const app = new EasyApp();
app.addEasyPack(authPack);

app.run();
