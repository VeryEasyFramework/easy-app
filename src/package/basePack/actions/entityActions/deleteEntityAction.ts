import { createAction } from "#/actions/createAction.ts";

export const deleteEntityAction = createAction("deleteEntity", {
  description: "Delete an entity",
  action: async (app, { entity, id }) => {
    const deleted = await app.orm.deleteEntity(entity, id);
    const room = `entity:${entity}`;
    const notifyData = {
      entity,
      id,
    };
    app.notify(room, "delete", notifyData);
    app.notify(room, "list", notifyData);
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
