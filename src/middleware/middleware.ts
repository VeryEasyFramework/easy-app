import type { EasyRequest } from "#/easyRequest.ts";
import type { EasyResponse } from "#/easyResponse.ts";
import type { EasyApp } from "#/easyApp.ts";

/**
 * Middleware function type
 */
export type MiddleWare = (
  /**
   * EasyApp instance
   */
  app: EasyApp,
  /**
   * EasyRequest instance
   */
  request: EasyRequest,
  /**
   * EasyResponse instance
   */
  response: EasyResponse,
) => Promise<void> | void;

/**
 * function to create a middleware for the app
 */
export function createMiddleware(
  middleware: MiddleWare,
): MiddleWare {
  return middleware;
}
