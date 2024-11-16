import { EasyApp } from "#/app/easyApp.ts";
import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { calculateMemorySettings } from "#orm/database/adapter/adapters/postgres/pgUtils.ts";

// const app = new EasyApp();
// const test = new EntryType("test", {
//   label: "Test",
//   description: "A test entry",
// });

// test.addField({
//   key: "tag",
//   label: "Tag",
//   fieldType: "ListField",
// });
// app.orm.addEntryType(test);
// app.run();


calculateMemorySettings();