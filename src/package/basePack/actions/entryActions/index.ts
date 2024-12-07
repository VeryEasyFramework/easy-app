import { createEntryAction } from "#/package/basePack/actions/entryActions/createEntryAction.ts";
import { updateEntryAction } from "#/package/basePack/actions/entryActions/updateEntryAction.ts";
import { getEntryAction } from "#/package/basePack/actions/entryActions/getEntryAction.ts";
import { deleteEntryAction } from "#/package/basePack/actions/entryActions/deleteEntryAction.ts";
import {
  runEntryActionAction,
} from "#/package/basePack/actions/entryActions/runEntryActionAction.ts";
import { getEntryListAction } from "#/package/basePack/actions/entryActions/getEntryListAction.ts";
import { getEntryInfoAction } from "#/package/basePack/actions/entryActions/getEntryInfoAction.ts";
import { getEntryTypeAction } from "#/package/basePack/actions/entryActions/getEntryTypeAction.ts";

import { globalSearchAction } from "#/package/basePack/actions/entryActions/globalSearchAction.ts";

import { rebuildSearchIndexAction } from "#/package/basePack/actions/entryActions/rebuildSearchIndex.ts";
export const entryActions = [
  getEntryListAction,
  createEntryAction,
  updateEntryAction,
  getEntryAction,
  deleteEntryAction,
  runEntryActionAction,
  getEntryInfoAction,
  getEntryTypeAction,
  globalSearchAction,
  rebuildSearchIndexAction,
];
