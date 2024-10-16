import type { EntityRecord } from "#orm/entity/entity/entityRecord/entityRecord.ts";
import type { SafeReturnType, SafeType } from "@vef/types";

export type EntityHookFunction = (
  entity: EntityRecord,
) => Promise<void> | void;

export type EntityActionFunction = (
  entity: EntityRecord,
  params?: Record<string, SafeType>,
) => SafeReturnType;
