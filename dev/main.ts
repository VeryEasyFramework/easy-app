import { createAction } from "#/actions/createAction.ts";
import { EasyApp } from "#/easyApp.ts";
import { defineEntity } from "@vef/easy-orm";
const app = new EasyApp({
  serverOptions: {
    port: 8000,
    reusePort: true,
  },
  // ormOptions: {
  //   databaseType: "postgres",
  //   databaseConfig: {
  //     camelCase: true,
  //     host: "localhost",
  //     port: 5432,
  //     size: 1,
  //     clientOptions: {
  //       database: "postgres",
  //       user: "postgres",
  //       camelCase: true,
  //       password: "postgres",
  //       host: "localhost",
  //       port: 5432,
  //     },
  //   },
  //   idFieldType: "BigIntField",
  // },
});

app.orm.addEntity(defineEntity("user", {
  fields: [
    {
      key: "firstName",
      fieldType: "DataField",
      required: true,
      inList: true,
    },
    {
      key: "lastName",
      fieldType: "DataField",
      required: true,
      inList: true,
    },
    {
      key: "email",
      fieldType: "DataField",
      inList: true,
    },
    {
      key: "age",
      fieldType: "IntField",
      inList: true,
    },
  ],
  label: "User",
}));
app.addAction(
  "test",
  createAction("test", {
    description: "Test action",
    action(app) {
      app.notify("test", "test", {
        message: "Hello World",
      });
      return {
        message: "done",
      };
    },
  }),
);
if (import.meta.main) {
  await app.run();
}
