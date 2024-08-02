import { EasyRequest } from "#/easyRequest.ts";
import { EasyResponse } from "#/easyResponse.ts";

// Define the Middleware types
export type MiddlewareWithResponse = (
  request: EasyRequest,
  response: EasyResponse,
) => Promise<EasyResponse>;
export type MiddlewareWithoutResponse = (request: EasyRequest) => Promise<void>;
