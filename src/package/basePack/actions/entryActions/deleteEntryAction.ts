import { createAction } from "#/actions/createAction.ts";

export const deleteEntryAction = createAction("deleteEntry", {
  description: "Delete an entry",
  action: async (app, { entryType, id }, request) => {
    return await app.orm.deleteEntry(entryType, id, request.user);
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
  response: "void",
});
