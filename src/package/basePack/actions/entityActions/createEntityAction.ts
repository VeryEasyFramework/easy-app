import { createAction } from "#/actions/createAction.ts";

export const createEntityAction = createAction("createEntity", {
  description: "Create a new entity",
  action: async (app, { entity, data }) => {
    const newEntity = await app.orm.createEntity(entity, data);
    const room = `entity:${entity}`;
    const notifyData = {
      entity,
      data: newEntity.data,
    };
    app.notify(room, "create", notifyData);
    app.notify(room, "list", notifyData);
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
