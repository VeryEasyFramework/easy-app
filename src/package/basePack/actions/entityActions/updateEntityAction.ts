import { createAction } from "#/actions/createAction.ts";

export const updateEntityAction = createAction("updateEntity", {
   description: "Update an entity",
   action: async (app, { entity, id, data }, request) => {
      const updatedEntity = await app.orm.updateEntity(
         entity,
         id,
         data,
         async (entityRecord, changedData) => {
            if (!changedData) {
               return;
            }
            if (entityRecord.entityDefinition.config.editLog) {
               const { titleField } = entityRecord.entityDefinition.config;
               const titleValue = titleField
                  ? entityRecord[titleField]
                  : entityRecord.id;
               await app.orm.createEntity("editLog", {
                  entity,
                  entityId: entityRecord.id,
                  action: "update",
                  entityTitle: titleValue,
                  user: request.user?.id,
                  editData: changedData,
               });
            }
         },
      );
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
