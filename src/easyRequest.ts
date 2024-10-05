import { easyLog } from "../mod.ts";
import { SessionData } from "./package/authPack/entities/userSession.ts";

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

  constructor(request: Request, prefix?: string) {
    this.sessionData = null;
    this.request = request;
    this.prefix = prefix;
    this.parseParams();
    this.extractCookies();
    this.getAuthToken();
    this.checkForSocketUpgrade();
    this.checkForFileExtension();
  }
  cleanedUrl: string = "";
  host: string = "";
  origin: string = "";
  originalUrl: string = "";
  prefix?: string;
  request: Request;
  cookies: Map<string, string> = new Map();
  authToken: string | null = null;
  group?: string;
  action?: string;
  body: Record<string, any> = {};
  method: RequestMethod = "GET";
  params: Record<string, any> = {};
  path: string = "";
  port?: number;
  isFile = false;
  fileExtension = "";
  sessionData: SessionData | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };

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
    this.upgradeSocket = connection === "upgrade" &&
      upgrade === "websocket" &&
      this.path === "/ws";
  }

  private getAuthToken() {
    const authHeader = this.request.headers.get("Authorization");
    if (authHeader) {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
        this.authToken = parts[1];
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
    this.cleanedUrl = this.request.url;
    if (this.prefix) {
      this.cleanedUrl = this.request.url.replace(this.prefix, "");
    }
    const url = new URL(this.cleanedUrl);
    this.method = this.request.method as RequestMethod;
    this.path = url.pathname;
    this.port = parseInt(url.port);
    this.host = url.hostname;
    this.originalUrl = url.origin;
    this.origin = url.origin;
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
