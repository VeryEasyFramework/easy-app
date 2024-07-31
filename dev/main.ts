import { EasyApp } from "../mod.ts";

const app = new EasyApp({ staticFileRoot: "./public" });

app.serve();
