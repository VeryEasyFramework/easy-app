import { EasyApp } from "#/app/easyApp.ts";
import { EntryType } from "../src/orm/entry/entry/entryType/entryType.ts";

const app = new EasyApp();
const test = new EntryType("test", {
  label: "Test",
  description: "A test entity",
});

test.addField({
  key: "tag",
  label: "Tag",
  fieldType: "ListField",
});
app.orm.addEntryType(test);
app.run();
