import { EasyApp } from "../mod.ts";
import { authPackage } from "../src/package/authPackage/authPack.ts";
import { EasyPack } from "../src/package/easyPack.ts";

const packagee = new EasyPack("myPackage");

packagee.defineEntity("User", {
  label: "User",
  fields: [
    {
      key: "email",
      label: "Email",
      fieldType: "DataField",
      required: true,
    },
    {
      key: "password",
      label: "Password",
      fieldType: "IntField",
      required: true,
    },
  ],
  actions: {
    async login(email: string, password: string) {
    },
  },
});
packagee.addAction({
  groupName: "thing",
  actionName: "test",
  action: async () => {
    console.log("Hello World");
  },
  description: "Test action",
});
const app = new EasyApp({});
app.addEasyPack(packagee);
app.run({
  clientProxyPort: 5174,
});
