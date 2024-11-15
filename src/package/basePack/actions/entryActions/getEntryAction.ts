import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";

export const getEntryAction = createAction("getEntry", {
  description: "Get a single entry",
  action: async (app, { entryType, id }, request) => {
    const result = await app.orm.getEntry(entryType, id, request.user);
    if (!result) {
      raiseEasyException("Entry not found", 404);
    }

    return result.data;
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
  response: "any",
});
