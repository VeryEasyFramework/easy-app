export class EasyException extends Error {
  constructor(
    message: string,
    public status: number,
    public name = "EasyException",
  ) {
    super(message);
  }
}

export function raiseEasyException(message: string, status: number): never {
  throw new EasyException(message, status);
}
