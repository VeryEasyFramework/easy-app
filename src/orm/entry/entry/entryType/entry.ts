import type {
  Choice,
  EasyField,
  EasyFieldTypeMap,
  SafeReturnType,
} from "@vef/types";
import type { EntryClass } from "../entryClass/entryClass.ts";

export interface Entry extends EntryClass {
  [key: string]: any;
}

export type TypedEntry<T> = EntryClass & T;

export interface EntryActionDefinition<
  T = Entry,
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

  customValidation?: boolean;
  action(
    entry: TypedEntry<T>,
    params: D,
  ): SafeReturnType;
  params?: F;
}
export interface EntryHookDefinition<T = Entry> {
  label?: string;
  description?: string;

  action(
    entry: TypedEntry<T>,
  ): Promise<void> | void;
}

export type EntryHook = keyof EntryHooks;
export interface EntryHooks<T = Entry> {
  beforeSave: Array<EntryHookDefinition<T>>;
  afterSave: Array<EntryHookDefinition<T>>;
  beforeInsert: Array<EntryHookDefinition<T>>;
  afterInsert: Array<EntryHookDefinition<T>>;
  validate: Array<EntryHookDefinition<T>>;
  beforeValidate: Array<EntryHookDefinition<T>>;

  beforeDelete: Array<EntryHookDefinition<T>>;
  afterDelete: Array<EntryHookDefinition<T>>;
}
