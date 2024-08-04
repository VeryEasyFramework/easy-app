import type { EasyApp } from "#/easyApp.ts";
import { raiseEasyException } from "#/easyException.ts";
import { EasyResponse } from "#/easyResponse.ts";

interface FieldTypeMap {
  string: string;
  number: number;
  boolean: boolean;
  date: Date;
  list: any[];
  object: Record<string, any>;
}

type EmptyObject<T extends PropertyKey = string> = Record<T, never>;
export type Action<
  P extends {
    [K in keyof P]: {
      required: boolean;
      type: keyof FieldTypeMap;
    };
  },
  D extends {
    [E in keyof P]: FieldTypeMap[P[E]["type"]];
  },
> = {
  name: string;
  description: string;
  action: (app: EasyApp, data: D) => Promise<any> | any;
  params?: P;
  response?: string;
};

export type InferredAction<A> = A extends Action<infer P, infer D>
  ? Action<P, D>
  : never;

export function createAction<
  P extends {
    [K in keyof P]: {
      required: boolean;
      type: keyof FieldTypeMap;
    };
  },
  D extends {
    [E in keyof P]: FieldTypeMap[P[E]["type"]];
  },
>(actionName: string, options: {
  description: string;
  public?: boolean;
  action: (
    app: EasyApp,
    data: D,
    response?: EasyResponse,
  ) => Promise<any> | any;
  params?: P;
  response?: string;
}): Action<P, D> {
  const paramsObj = {} as D;
  const requiredParams = [] as Array<keyof P>;
  const paramKeys = [] as Array<keyof P>;
  for (const paramKey in options.params) {
    if (options.params[paramKey].required) {
      requiredParams.push(paramKey);
    }
    paramKeys.push(paramKey);
  }
  const newAction = async (
    app: EasyApp,
    data?: D,
    response?: EasyResponse,
  ) => {
    if (!data && requiredParams.length > 0) {
      raiseEasyException(
        `Missing required parameters: ${Object.keys(paramsObj).join(", ")}`,
        400,
      );
    }
    if (data) {
      const missingParams = [];
      for (const key of paramKeys) {
        if (requiredParams.includes(key) && !data[key]) {
          missingParams.push(key);
          continue;
        }
        paramsObj[key] = data[key];
      }
      if (missingParams.length > 0) {
        raiseEasyException(
          `Missing required parameters: ${missingParams.join(", ")}`,
          400,
        );
      }
    }
    return await options.action(app, paramsObj, response);
  };
  return {
    name: actionName,
    description: options.description,
    action: newAction,
    params: options.params,
    response: options.response,
  };
}
