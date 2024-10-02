import { createAction } from "#/actions/createAction.ts";

export const createEntityAction = createAction("createEntity", {
   description: "Create a new entity",
   action: async (app, { entity, data }, request) => {
      const newEntity = await app.orm.createEntity(entity, data);
      const { titleField } = newEntity.entityDefinition.config;
      const titleValue = titleField ? newEntity[titleField] : newEntity.id;
      await app.orm.createEntity("editLog", {
         entity,
         entityId: newEntity.id,
         action: "create",
         entityTitle: titleValue,
         user: request.user?.id,
         editData: newEntity.data,
      });
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
