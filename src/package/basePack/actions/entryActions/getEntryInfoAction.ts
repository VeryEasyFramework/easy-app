import { createAction } from "#/actions/createAction.ts";
import { editLogEntry } from "#/package/basePack/entities/editLogEntry.ts";

export const getRecordInfoAction = createAction("getRecordInfo", {
  description: "Get summary information about a record",
  async action(app, { entity, id }, request) {
    const editLog = await app.orm.getEntryList("editLog", {
      filter: {
        entity,
        recordId: id,
      },
      columns: [
        "id",
        "createdAt",
        "updatedAt",
        ...editLogEntry.fields.map((field) => field.key),
      ],
    }, request.user);
    return {
      editLog: editLog.data,
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
