import type {
  Choice,
  EasyField,
  EasyFieldTypeMap,
  SafeReturnType,
} from "@vef/types";
import type { EntityRecordClass } from "#orm/entity/entity/entityRecord/entityRecord.ts";

export interface EntityActionDefinition<
  F extends Array<EasyField> = Array<EasyField>,
  D extends {
    [key in F[number]["key"]]: F[number]["choices"] extends Choice<infer T>[]
      ? F[number]["choices"][number]["key"]
      : EasyFieldTypeMap[F[number]["fieldType"]];
  } = {
    [key in F[number]["key"]]: F[number]["choices"] extends Choice<infer T>[]
      ? F[number]["choices"][number]["key"]
      : EasyFieldTypeMap[F[number]["fieldType"]];
  },
> {
  label?: string;
  description?: string;

  /**
   * If true, this action can only be called internally
   */
  private?: boolean;

  /**
   * If true, this action can be called without loading a specific entity first
   */
  global?: boolean;
  action(
    entity: EntityRecordClass,
    params: D,
  ): SafeReturnType;
  params?: F;
}
export interface EntityHookDefinition {
  label?: string;
  description?: string;

  action(entity: EntityRecordClass): Promise<void> | void;
}

export type EntityHook = keyof EasyEntityHooks;
export interface EasyEntityHooks {
  beforeSave: Array<EntityHookDefinition>;
  afterSave: Array<EntityHookDefinition>;
  beforeInsert: Array<EntityHookDefinition>;
  afterInsert: Array<EntityHookDefinition>;
  validate: Array<EntityHookDefinition>;
  beforeValidate: Array<EntityHookDefinition>;

  beforeDelete: Array<EntityHookDefinition>;
  afterDelete: Array<EntityHookDefinition>;
}
