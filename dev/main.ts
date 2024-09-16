import { EasyApp } from "#/easyApp.ts";
import { authPack } from "../src/package/authPack/authPack.ts";

const app = new EasyApp();

app.addEasyPack(authPack);

app.run();
