import { EasyApp } from "#/easyApp.ts";
import { authPack } from "#/package/authPack/authPack.ts";
import { emailPack } from "../mod.ts";

const app = new EasyApp();
app.addEasyPack(authPack);
app.addEasyPack(emailPack);

app.run();
