import type { EasyRequest } from "#/easyRequest.ts";
import type { EasyResponse } from "#/easyResponse.ts";
import { EasyApp } from "#/easyApp.ts";

export type MiddlewareWithResponse = (
  app: EasyApp,
  request: EasyRequest,
  response: EasyResponse,
) => Promise<EasyResponse>;
export type MiddlewareWithoutResponse = (
  app: EasyApp,
  request: EasyRequest,
) => Promise<void>;
