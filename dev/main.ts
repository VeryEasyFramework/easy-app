import { EasyApp } from "#/app/easyApp.ts";
import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import type { Test } from "./generatedTypes/testInterface.ts";

const app = new EasyApp();
const test = new EntryType<Test>("test", {
  label: "Test",
  description: "A test entry",
});
test.setConfig({
  titleField: "tag",
  statusField: "status",
});
test.addField({
  key: "tag",
  label: "Tag",
  fieldType: "ListField",
  description: "A list of tags",
});

test.addFields([
  {
    key: "status",
    label: "Status",
    required: true,
    fieldType: "ChoicesField",
    choices: ["Active", "Inactive"],
  },
]);

test.addHook("beforeSave", {
  action(entry) {
    entry.status = "Active";
  },
});

test.addAction("testAction", {
  action(entry, params) {
    entry.tag;
    entry.status;
  },
});
const testType = test.generateType();
console.log(testType);
// app.orm.addEntryType(test);
// app.run();
