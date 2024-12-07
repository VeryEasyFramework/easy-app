import { EasyApp } from "#/app/easyApp.ts";
import { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import type { Test } from "./generatedTypes/testInterface.ts";

const app = new EasyApp();
const test = new EntryType<Test>("test", {
  label: "Test",
  description: "A test entry",
});
test.setConfig({
  titleField: "name",
  statusField: "status",
  globalSearch: true,
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
  {
    key: "name",
    label: "Name",
    fieldType: "DataField",
    required: true,
  },
  {
    key: "email",
    label: "Email",
    fieldType: "EmailField",
    inGlobalSearch: true,
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

app.orm.addEntryType(test);
app.run();
