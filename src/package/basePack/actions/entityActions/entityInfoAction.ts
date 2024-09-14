import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";

export const getEntityInfoAction = createAction("getEntityInfo", {
  description: "Get the entity info",
  action: (app, { entity }) => {
    const entityDef = app.orm.entities[entity];
    if (!entityDef) {
      raiseEasyException("Entity not found", 404);
    }
    return entityDef;
  },
  params: {
    entity: {
      required: true,
      type: "DataField",
    },
  },
  response: "EntityInfo",
});
