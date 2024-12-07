import { createAction } from "#/actions/createAction.ts";

export const rebuildSearchIndexAction = createAction("rebuildSearchIndex", {
  description: "Search globally for entries that match a search term",
  async action(app, _data, request) {
    const results = await app.orm.globalSearch.rebuildIndex();
    return results;
  },
});
