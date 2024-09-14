import { createEntityAction } from "#/package/basePack/actions/entityActions/createEntityAction.ts";
import { updateEntityAction } from "#/package/basePack/actions/entityActions/updateEntityAction.ts";
import { getEntityAction } from "#/package/basePack/actions/entityActions/getEntityAction.ts";
import { deleteEntityAction } from "#/package/basePack/actions/entityActions/deleteEntityAction.ts";
import { getEntityInfoAction } from "#/package/basePack/actions/entityActions/entityInfoAction.ts";
import { runEntityActionAction } from "#/package/basePack/actions/entityActions/runEntityActionAction.ts";
import { getEntityListAction } from "#/package/basePack/actions/entityActions/getEntityListAction.ts";

export const entityActions = [
  getEntityListAction,
  createEntityAction,
  updateEntityAction,
  getEntityAction,
  deleteEntityAction,
  getEntityInfoAction,
  runEntityActionAction,
];
