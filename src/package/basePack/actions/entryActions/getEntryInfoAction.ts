import { createAction } from "#/actions/createAction.ts";
import { editLogEntry } from "#/package/basePack/entryTypes/editLogEntry.ts";

export const getEntryInfoAction = createAction("getEntryInfo", {
  description: "Get summary information about a record",
  async action(app, { entryType, id }, request) {
    const editLog = await app.orm.getEntryList("editLog", {
      filter: {
        entryType,
        entryId: id,
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
    entryType: {
      required: true,
      type: "DataField",
    },
    id: {
      required: true,
      type: "DataField",
    },
  },
});
