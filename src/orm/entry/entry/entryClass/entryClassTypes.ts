import type { EntryClass } from "./entryClass.ts";
import type { SafeReturnType, SafeType } from "@vef/types";

export type EntryHookFunction = (
  entity: EntryClass,
) => Promise<void> | void;

export type EntityActionFunction = (
  entity: EntryClass,
  params?: Record<string, SafeType>,
) => SafeReturnType;
