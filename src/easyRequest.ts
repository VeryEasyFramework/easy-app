type RequestMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "HEAD"
  | "CONNECT"
  | "TRACE";

export class EasyRequest {
  upgradeSocket!: boolean;

  constructor(request: Request) {
    this.request = request;
    this.parseParams();
    this.extractCookies();
    this.getAuthToken();
    this.checkForSocketUpgrade();
    this.checkForFileExtension();
  }

  request: Request;
  cookies: Map<string, string> = new Map();
  authToken: string | null = null;
  group: string | null = null;
  action: string | null = null;
  body: Record<string, any> = {};
  method: RequestMethod = "GET";
  params: Record<string, any> = {};
  path: string = "";
  isFile = false;
  fileExtension = "";

  private checkForFileExtension() {
    const pathParts = this.path.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    const parts = lastPart.split(".");
    if (parts.length < 2) {
      return;
    }
    const ext = parts[parts.length - 1];
    if (ext) {
      this.isFile = true;
      this.fileExtension = ext;
    }
  }
  private checkForSocketUpgrade() {
    let connection = "";
    let upgrade = "";
    this.request.headers.forEach((value, key) => {
      if (key.toLowerCase() === "connection") {
        connection = value.toLowerCase();
      }
      if (key.toLowerCase() === "upgrade") {
        upgrade = value.toLowerCase();
      }
    });
    this.upgradeSocket = connection === "upgrade" && upgrade === "websocket" &&
      this.path === "/ws";
  }

  private getAuthToken() {
    const authHeader = this.request.headers.get("Authorization");
    if (authHeader) {
      const [type, token] = authHeader.split(" ");
      if (type === "Bearer") {
        this.authToken = token;
      }
    }
  }

  private extractCookies() {
    const cookie = this.request.headers.get("cookie");

    if (cookie) {
      const cookiePairs = cookie.split(";");
      cookiePairs.forEach((pair) => {
        const [key, value] = pair.trim().split("=");
        this.cookies.set(key, value);
      });
    }
  }

  private parseParams() {
    const url = new URL(this.request.url);
    this.method = this.request.method as RequestMethod;
    this.path = url.pathname;
    const params = url.searchParams;
    for (const [key, value] of params) {
      switch (key) {
        case "group":
          this.group = value;
          break;
        case "action":
          this.action = value;
          break;
        default:
          this.params[key] = value;
      }
    }
  }

  async loadBody() {
    try {
      const body = await this.request.json();
      this.body = { ...body, ...this.params };
    } catch (_e) {
      this.body = this.params;
    }
  }
}
