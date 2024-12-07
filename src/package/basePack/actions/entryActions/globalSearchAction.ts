import { createAction } from "#/actions/createAction.ts";

export const globalSearchAction = createAction("globalSearch", {
  description: "Search globally for entries that match a search term",
  async action(app, { searchTerm }, request) {
    const results = await app.orm.search(searchTerm, request.user);
    return results;
  },
  params: {
    searchTerm: {
      required: true,
      type: "DataField",
    },
  },
});
