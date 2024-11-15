import { createAction } from "#/actions/createAction.ts";

export const updateEntityAction = createAction("updateEntity", {
  description: "Update an entity",
  action: async (app, { entity, id, data }, request) => {
    const updatedEntity = await app.orm.updateEntry(
      entity,
      id,
      data,
      request.user,
    );

    return updatedEntity.data;
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
    data: {
      required: true,
      type: "JSONField",
    },
  },
  response: "any",
});
