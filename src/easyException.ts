export class EasyException extends Error {
  constructor(
    message: string,
    public status: number,
    override name = "EasyException",
    public redirect?: string,
  ) {
    super(message);
  }
}

export class RedirectException extends Error {
  constructor(
    public url: string,
    message?: string,
    override name = "RedirectException",
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

export function raiseRedirect(
  url: string,
  message?: string,
  status?: 302 | 301,
): never {
  throw new RedirectException(url, message);
}
