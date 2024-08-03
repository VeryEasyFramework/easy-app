export class EasyApi {
  constructor() {
  }
  async fetch(url: string, options: RequestInit): Promise<Response> {
    return await fetch(url, options);
  }
}
