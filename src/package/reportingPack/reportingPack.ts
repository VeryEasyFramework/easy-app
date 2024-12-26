import { EasyPack } from "#/package/easyPack.ts";
import { createAction } from "#/actions/createAction.ts";
import type { ReportOptions } from "#orm/reports.ts";

export const reportingPack = new EasyPack("reporting");

reportingPack.addAction(
  "reporting",
  createAction("getReport", {
    description: "Get a report",
    async action(app, params, request, response) {
      const { user } = request;
      const { orm } = app;
      let join: ReportOptions["join"] = undefined;
      if (params.joinType && params.joinColumns && params.joinEntryType) {
        join = {
          type: params.joinType as "left" | "right" | "inner" || "left",
          columns: params.joinColumns,
          entryType: params.joinEntryType,
          filter: params.joinFilter,
        };
      }
      const order = ["asc", "desc"].includes(params.order)
        ? params.order as "asc" | "desc"
        : undefined;
      const options: ReportOptions = {
        columns: params.columns,
        subGroup: params.subGroup,
        filter: params.filter,
        limit: params.limit,
        join: join,
        offset: params.offset,
        orderBy: params.orderBy,
        order: order,
        orFilter: params.orFilter,
        groupBy: params.groupBy,
      };
      return await orm.getReport(params.entryType, options, user);
    },
    params: {
      entryType: {
        type: "DataField",
        required: true,
      },
      columns: {
        type: "ListField",
        required: false,
      },
      subGroup: {
        type: "DataField",
        required: false,
      },
      filter: {
        type: "JSONField",
        required: false,
      },
      orFilter: {
        type: "JSONField",
        required: false,
      },
      joinEntryType: {
        type: "DataField",
        required: false,
      },
      joinType: {
        type: "DataField",
        required: false,
      },
      joinColumns: {
        type: "ListField",
        required: false,
      },
      joinFilter: {
        type: "JSONField",
        required: false,
      },
      limit: {
        type: "IntField",
        required: false,
      },
      offset: {
        type: "IntField",
        required: false,
      },
      orderBy: {
        type: "DataField",
        required: false,
      },
      order: {
        type: "DataField",
        required: false,
      },
      groupBy: {
        type: "DataField",
        required: false,
      },
    },
  }),
);
