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
  hooks: {
    async beforeSave() {
      this.email;
    },
  },
  actions: {
    async login(email: string, password: string) {
    },
  },
});
const app = new EasyApp({});
app.addPackage(authPackage);
app.run({
  clientProxyPort: 5174,
});
