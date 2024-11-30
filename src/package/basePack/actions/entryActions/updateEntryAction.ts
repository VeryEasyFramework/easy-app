import { createAction } from "#/actions/createAction.ts";

export const updateEntryAction = createAction("updateEntry", {
  description: "Update an entry",
  action: async (app, { entryType, id, data }, request) => {
    const updatedEntry = await app.orm.updateEntry(
      entryType,
      id,
      data,
      request.user,
    );

    return updatedEntry.data;
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
    data: {
      required: true,
      type: "JSONField",
    },
  },
  response: "any",
});
