export class EasyException extends Error {
  constructor(
    message: string,
    public status: number,
    public name = "EasyException",
    public redirect?: string,
  ) {
    super(message);
  }
}

export function raiseEasyException(
  message: string,
  status: number,
  redirect?: string,
): never {
  throw new EasyException(message, status, undefined, redirect);
}
