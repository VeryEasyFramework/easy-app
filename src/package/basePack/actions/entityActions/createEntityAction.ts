import { createAction } from "#/actions/createAction.ts";

export const createEntityAction = createAction("createEntity", {
  description: "Create a new entity",
  action: async (app, { entity, data }, request) => {
    const newEntity = await app.orm.createEntity(entity, data, request.user);

    return newEntity.data;
  },
  params: {
    entity: {
      required: true,
      type: "DataField",
    },
    data: {
      required: true,
      type: "JSONField",
    },
  },
  response: "any",
});
