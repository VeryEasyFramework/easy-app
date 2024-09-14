export class EasyResponse {
  content: Record<string, any> = {};
  cookies: Record<string, string> = {};
  headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  constructor() {
  }
  setAllowOrigin(origin: string) {
    this.headers["Access-Control-Allow-Origin"] = origin;
  }
  setCookie(key: string, value: string) {
    this.cookies[key] = value;
  }

  setCookies(cookies: Record<string, string>) {
    this.cookies = cookies;
  }

  clearCookie(key: string) {
    this.cookies[key] = "";
  }

  setResponseCookie(): void {
    const cookiePairs = Object.entries(this.cookies);
    const cookieStrings = cookiePairs.map(([key, value]) => {
      let cookie = `${key}=${value}`;
      if (value === "") {
        cookie += "; Max-Age=0";
      }
      return cookie;
    });
    this.headers["Set-Cookie"] = cookieStrings.join("; ");
  }

  error(message: string, code: number, reason?: string): Response {
    this.content = { error: message, code: code, reason: reason };
    this.setResponseCookie();
    return new Response(
      JSON.stringify(this.content),
      {
        headers: this.headers,
        status: code,
        statusText: reason || "Error",
      },
    );
  }

  redirect(url: string): Response {
    return Response.redirect(url, 302);
  }

  respond(): Response {
    this.setResponseCookie();
    return new Response(
      JSON.stringify(this.content),
      {
        headers: this.headers,
        status: 200,
        statusText: "OK",
      },
    );
  }
}
