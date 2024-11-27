import { EasyPack } from "#/package/easyPack.ts";
import { createAction } from "#/actions/createAction.ts";

export const reportingPack = new EasyPack("reporting");

reportingPack.addAction(
  "reporting",
  createAction("getReport", {
    description: "Get a report",
    async action(app, { entryType }, request, response) {
    },
    params: {
      entryType: {
        type: "DataField",
        required: true,
      },
      columns: {
        type: "ListField",
        required: true,
      },
    },
  }),
);
