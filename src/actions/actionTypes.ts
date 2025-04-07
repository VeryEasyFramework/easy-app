import type { EasyResponse } from "#/app/easyResponse.ts";
import type { EasyApp } from "#/app/easyApp.ts";
import type { EasyFieldType, EasyFieldTypeMap } from "#/vef-types/mod.ts";
import type { EasyRequest } from "#/app/easyRequest.ts";
export interface ActionBase<
  P extends CreateActionParams<P>,
  D extends ActionParams<P>,
> {
  description: string;
  action: (
    app: EasyApp,
    data: D,
    request: EasyRequest,
    response: EasyResponse,
  ) => Promise<any> | any;

  public?: boolean;
  system?: boolean;
  params?: P;
  response?: string;
}

export interface EasyAction extends ActionBase<any, any> {
  actionName: string;
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
  system?: boolean;
  public?: boolean;
}

export interface DocsActionGroup {
  groupName: string;
  actions: Array<DocsAction>;
}
