import { createAction } from "#/actions/createAction.ts";

export const updateEntityAction = createAction("updateEntity", {
  description: "Update an entity",
  action: async (app, { entity, id, data }) => {
    const updatedEntity = await app.orm.updateEntity(entity, id, data);
    const room = `entity:${entity}`;
    const notifyData = {
      entity,
      data: updatedEntity.data,
    };
    app.notify(room, "update", notifyData);
    app.notify(room, "list", notifyData);
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
