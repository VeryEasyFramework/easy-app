import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";

export const getEntryTypeAction = createAction("getEntryType", {
  description: "Get the entry info",
  action: (app, { entryType }) => {
    const entryTypeDef = app.orm.entryTypes[entryType];
    if (!entryTypeDef) {
      raiseEasyException("Entry not found", 404);
    }
    return entryTypeDef;
  },
  params: {
    entryType: {
      required: true,
      type: "DataField",
    },
  },
  response: "EntryInfo",
});
