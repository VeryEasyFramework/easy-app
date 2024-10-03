import { createAction } from "#/actions/createAction.ts";

export const deleteEntityAction = createAction("deleteEntity", {
  description: "Delete an entity",
  action: async (app, { entity, id }, request) => {
    const deleted = await app.orm.deleteEntity(entity, id, request.user);

    return deleted;
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
  response: "void",
});
