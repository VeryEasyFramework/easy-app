export class EasyResponse {
  content: Record<string, any> = {};
  cookies: Record<string, string> = {};
  headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  constructor() {
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

  setResponseCookie() {
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

  error(message: string, code: number, reason?: string) {
    this.content = { error: message, code: code, reason: reason };
    return new Response(
      JSON.stringify(this.content),
      {
        headers: this.headers,
        status: code,
        statusText: reason || "Error",
      },
    );
  }

  redirect(url: string) {
    return Response.redirect(url, 302);
  }

  respond() {
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
