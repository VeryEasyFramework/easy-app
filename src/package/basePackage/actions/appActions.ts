import { createAction } from "#/actions/createAction.ts";
export const appActions = [
  createAction("apiDocs", {
    description: "Get the API for the app",
    action: (app) => {
      return app.apiDocs;
    },
    response: "APIGroup[]",
  }),
  createAction("apiTypes", {
    description: "Get the types for the app",
    action: (app) => {
      return app.requestTypes;
    },
    response: "string",
  }),
];
