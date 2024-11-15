import type { Choice, EasyField, EasyFieldTypeMap, SafeReturnType, } from "@vef/types";
import type { EntryClass } from "../entryClass/entryClass.ts";

export interface Entry extends EntryClass {
  [key: string]: any;
}
export interface EntryActionDefinition<
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
   * If true, this action can be called without loading a specific entry first
   */
  global?: boolean;
  action(
    entry: Entry,
    params: D,
  ): SafeReturnType;
  params?: F;
}
export interface EntryHookDefinition {
  label?: string;
  description?: string;

  action(
    entry: Entry,
  ): Promise<void> | void;
}

export type EntryHook = keyof EntryHooks;
export interface EntryHooks {
  beforeSave: Array<EntryHookDefinition>;
  afterSave: Array<EntryHookDefinition>;
  beforeInsert: Array<EntryHookDefinition>;
  afterInsert: Array<EntryHookDefinition>;
  validate: Array<EntryHookDefinition>;
  beforeValidate: Array<EntryHookDefinition>;

  beforeDelete: Array<EntryHookDefinition>;
  afterDelete: Array<EntryHookDefinition>;
}
