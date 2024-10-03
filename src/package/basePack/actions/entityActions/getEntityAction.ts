import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";

export const getEntityAction = createAction("getEntity", {
  description: "Get a single entity",
  action: async (app, { entity, id }, request) => {
    const result = await app.orm.getEntity(entity, id, request.user);
    if (!result) {
      raiseEasyException("Entity not found", 404);
    }

    return result.data;
  },
  params: {
    entity: {
      required: true,
      type: "DataField",
    },
    id: {
      required: true,
      type: "DataField",
    },
  },
  response: "any",
});
