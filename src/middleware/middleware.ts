import type { EasyRequest } from "#/easyRequest.ts";
import type { EasyResponse } from "#/easyResponse.ts";
import type { EasyApp } from "#/easyApp.ts";

export type MiddleWare = (
  app: EasyApp,
  request: EasyRequest,
  response: EasyResponse,
) => Promise<void> | void;

export function createMiddleware(
  middleware: MiddleWare,
): MiddleWare {
  return middleware;
}
