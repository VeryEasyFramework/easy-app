import type { EntryClass } from "#orm/entry/entry/entryClass/entryClass.ts";
import type { SafeReturnType, SafeType } from "@vef/types";

export type EntryHookFunction = (
  entry: EntryClass,
) => Promise<void> | void;

export type EntryActionFunction = (
  entry: EntryClass,
  params?: Record<string, SafeType>,
) => SafeReturnType;
