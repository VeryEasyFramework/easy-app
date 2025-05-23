import { createAction } from "#/actions/createAction.ts";
import type { ListOptions } from "#/vef-types/mod.ts";
import { raiseEasyException } from "#/easyException.ts";

export const getEntryListAction = createAction("getList", {
  description: "Get a list of entries",
  action: async (app, data, request) => {
    const options = {} as ListOptions;
    if (data.filter) {
      options.filter = data.filter;
    }
    if (data.limit) {
      options.limit = data.limit;
    }
    if (data.offset) {
      options.offset = data.offset;
    }
    if (data.orderBy) {
      options.orderBy = data.orderBy;
    }
    if (data.orFilter) {
      options.orFilter = data.orFilter;
    }
    if (data.order) {
      if (data.order !== "asc" && data.order !== "desc") {
        raiseEasyException(
          "Invalid order value. Must be 'asc' or 'desc'",
          400,
        );
      }
      options.order = data.order as "asc" | "desc";
    }
    if (data.columns) {
      options.columns = data.columns as unknown as string[];
    }
    if (data.withTotals) {
      options.withTotals = data.withTotals;
    }
    return await app.orm.getEntryList(data.entryType, options, request.user);
  },
  params: {
    entryType: {
      required: true,
      type: "DataField",
    },
    filter: {
      required: false,
      type: "JSONField",
    },
    orFilter: {
      required: false,
      type: "JSONField",
    },
    limit: {
      required: false,
      type: "IntField",
    },
    offset: {
      required: false,
      type: "IntField",
    },
    orderBy: {
      required: false,
      type: "DataField",
    },
    order: {
      required: false,
      type: "DataField",
    },
    columns: {
      required: false,
      type: "DataField",
    },
    withTotals: {
      required: false,
      type: "ListField",
    },
  },
  response: "any[]",
});
