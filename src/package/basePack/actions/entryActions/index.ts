import { createEntryAction } from "#/package/basePack/actions/entityActions/createEntryAction.ts";
import { updateEntityAction } from "#/package/basePack/actions/entityActions/updateEntityAction.ts";
import { getEntityAction } from "#/package/basePack/actions/entityActions/getEntityAction.ts";
import { deleteEntryAction } from "#/package/basePack/actions/entityActions/deleteEntryAction.ts";
import { getEntryInfoAction } from "#/package/basePack/actions/entityActions/entryInfoAction.ts";
import {
  runEntityActionAction,
} from "#/package/basePack/actions/entityActions/runEntityActionAction.ts";
import {
  getEntityListAction,
} from "#/package/basePack/actions/entityActions/getEntityListAction.ts";
import {
  getRecordInfoAction,
} from "#/package/basePack/actions/entityActions/getRecordInfoAction.ts";

export const entryActions = [
  getEntityListAction,
  createEntryAction,
  updateEntityAction,
  getEntityAction,
  deleteEntryAction,
  getEntryInfoAction,
  runEntityActionAction,
  getRecordInfoAction,
];
