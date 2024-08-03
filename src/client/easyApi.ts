export class EasyApi {
  constructor() {
  }
  async fetch(url: string, options: RequestInit) {
    return await fetch(url, options);
  }
}
