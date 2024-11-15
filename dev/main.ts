import { EasyApp } from "#/app/easyApp.ts";
import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";

const app = new EasyApp();
const test = new EntryType("test", {
  label: "Test",
  description: "A test entry",
});

test.addField({
  key: "tag",
  label: "Tag",
  fieldType: "ListField",
});
app.orm.addEntryType(test);
app.run();
