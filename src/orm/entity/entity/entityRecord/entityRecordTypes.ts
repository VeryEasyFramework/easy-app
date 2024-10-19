import type { EntityRecordClass } from "#orm/entity/entity/entityRecord/entityRecord.ts";
import type { SafeReturnType, SafeType } from "@vef/types";

export type EntityHookFunction = (
  entity: EntityRecordClass,
) => Promise<void> | void;

export type EntityActionFunction = (
  entity: EntityRecordClass,
  params?: Record<string, SafeType>,
) => SafeReturnType;
