import { EasyApp } from "#/app/easyApp.ts";
import { EasyEntity } from "#orm/entity/entity/entityDefinition/easyEntity.ts";

const app = new EasyApp();
const test = new EasyEntity("test", {
  label: "Test",
  description: "A test entity",
});

test.addField({
  key: "tag",
  label: "Tag",
  fieldType: "ListField",
});
app.orm.addEntity(test);
app.run();
