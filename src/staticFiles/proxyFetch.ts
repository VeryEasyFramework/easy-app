import type { EasyRequest } from "#/app/easyRequest.ts";

export async function fetchProxy(
  easyRequest: EasyRequest,
  clientProxy: string,
) {
  const url = `${clientProxy}${easyRequest.path}`;
  console.log(`Proxying request to: ${url}`);
  console.log(easyRequest.request.url);
  const response = await fetch(url);
  return response;
}
