import type { EasyApp } from "#/easyApp.ts";
import { raiseEasyException } from "#/easyException.ts";
import type { EasyResponse } from "#/easyResponse.ts";
import type {
  Action,
  ActionParams,
  CreateActionOptions,
  CreateActionParams,
} from "#/actions/actionTypes.ts";
import { EasyRequest } from "#/easyRequest.ts";

export function createAction<
  P extends CreateActionParams<P>,
  D extends ActionParams<P>,
>(
  actionName: string,
  options: CreateActionOptions<P, D>,
): Action<P, D> {
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
    request?: EasyRequest,
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
    return await options.action(app, paramsObj, request, response);
  };
  return {
    actionName,
    description: options.description,
    action: newAction,
    public: options.public,
    params: options.params,
    response: options.response,
  };
}
