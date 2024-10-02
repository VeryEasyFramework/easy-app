import { createAction } from "#/actions/createAction.ts";

export const getRecordInfoAction = createAction("getRecordInfo", {
   description: "Get summary information about a record",
   async action(app, { entity, id }) {
      const editlog = await app.orm.getEntityList("editLog", {
         filter: {
            entity,
            entityId: id,
         },
         columns: "*",
      });
      return {
         editLog: editlog.data,
      };
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
});
