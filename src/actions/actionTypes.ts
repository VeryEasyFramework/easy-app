import type { EasyResponse } from "#/easyResponse.ts";
import type { EasyApp } from "#/easyApp.ts";
import type { EasyFieldType, EasyFieldTypeMap } from "@vef/easy-orm";
import { EasyRequest } from "#/easyRequest.ts";

export type Action<
  P extends {
    [K in keyof P]: {
      required: boolean;
      type: keyof EasyFieldTypeMap;
    };
  },
  D extends {
    [E in keyof P]: EasyFieldTypeMap[P[E]["type"]];
  },
> = {
  actionName: string;
  description: string;
  action: (
    app: EasyApp,
    data: D,
    request?: EasyRequest,
    response?: EasyResponse,
  ) => Promise<any> | any;
  params?: P;
  response?: string;
  public?: boolean;
};

export interface EasyAction {
  actionName: string;
  description: string;
  action: (
    app: EasyApp,
    data: any,
    request?: EasyRequest,
    response?: EasyResponse,
  ) => Promise<any> | any;
  params?: Record<string, any>;
  response?: string;
  public?: boolean;
}

export type InferredAction<A> = A extends Action<infer P, infer D>
  ? Action<P, D>
  : never;

export interface CreateActionOptions<
  P extends Record<string, any>,
  D extends Record<string, any>,
> {
  description: string;
  public?: boolean;
  action: (
    app: EasyApp,
    data: D,
    request?: EasyRequest,
    response?: EasyResponse,
  ) => Promise<any> | any;
  params?: P;
  response?: string;
}
export type CreateActionParams<P> = {
  [K in keyof P]: {
    required: boolean;
    type: keyof EasyFieldTypeMap;
  };
};

export type ActionParams<P extends CreateActionParams<P>> = {
  [E in keyof P]: EasyFieldTypeMap[P[E]["type"]];
};

export interface DocsActionParam {
  paramName: string;
  required: boolean;
  type: EasyFieldType;
}
export interface DocsAction {
  actionName: string;
  description: string;
  params?: Array<DocsActionParam>;
  response?: string;
  public?: boolean;
}

export interface DocsActionGroup {
  groupName: string;
  actions: Array<DocsAction>;
}
