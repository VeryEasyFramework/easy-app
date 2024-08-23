import { EasyApp } from "#/easyApp.ts";
import { defineEntity } from "../../easy-orm/src/entity/defineEntity.ts";

export const app = new EasyApp({
  serverOptions: {
    port: 8000,
    reusePort: true,
  },
});

app.orm.addEntity(defineEntity("user", {
  fields: [
    {
      key: "name",
      fieldType: "DataField",
    },
  ],
  label: "User",
}));

// app.addWorker("task", import.meta.resolve("./queue.ts"));
