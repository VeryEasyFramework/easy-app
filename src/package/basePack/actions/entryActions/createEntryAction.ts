import { createAction } from "#/actions/createAction.ts";

export const createEntryAction = createAction("createEntry", {
  description: "Create a new entry",
  action: async (app, { entryType, data }, request) => {
    const newEntry = await app.orm.createEntry(entryType, data, request.user);

    return newEntry.data;
  },
  params: {
    entryType: {
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
