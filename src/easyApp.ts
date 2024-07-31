import { EasyException, raiseEasyException } from "#/easyException.ts";
import { EasyRequest } from "#/easyRequest.ts";
import { EasyResponse } from "#/easyResponse.ts";
import { StaticFileHandler } from "#/staticFiles/staticFileHandler.ts";
import { joinPath } from "#/utils.ts";
interface EasyAppOptions {
  appRootPath?: string;
  staticFileRoot?: string;
}
export class EasyApp {
  private server?: Deno.HttpServer;
  staticFileHandler: StaticFileHandler;
  actions: Record<string, Record<string, any>>;
  constructor(options: EasyAppOptions) {
    const appRootPath = options.appRootPath || Deno.cwd();
    const staticFileRoot = options.staticFileRoot ||
      joinPath(appRootPath, "public");
    this.staticFileHandler = new StaticFileHandler(staticFileRoot);
    this.actions = {};
  }

  serve(options?: Deno.ServeOptions) {
    options = options || { port: 8000 };
    this.server = Deno.serve(
      options,
      async (request: Request): Promise<Response> => {
        const easyRequest = new EasyRequest(request);
        const easyResponse = new EasyResponse();
        if (easyRequest.method === "OPTIONS") {
          return easyResponse.respond();
        }
        if (easyRequest.upgradeSocket) {
          // TODO: Handle WebSocket Upgrade
          return easyResponse.error("WebSocket is not implemented", 501);
        }
        try {
          switch (easyRequest.path) {
            case "/api":
              easyResponse.content = await this.apiHandler(easyRequest);
              break;
            default:
              return await this.staticFileHandler.serveFile(easyRequest);
          }
          return easyResponse.respond();
        } catch (_e: EasyException | Error | unknown) {
          if (_e instanceof EasyException) {
            return easyResponse.error(_e.message, _e.status);
          }
          console.error(_e);

          return easyResponse.error("Internal Server Error", 500);
        }
      },
    );
  }
  private async apiHandler(request: EasyRequest) {
    if (!request.group) {
      raiseEasyException("No group specified", 400);
    }
    const requestGroup = request.group;
    const requestCommand = request.command;
    if (!requestCommand) {
      raiseEasyException(
        `No command specified for group: ${requestGroup}`,
        400,
      );
    }
    const command = this.actions[requestGroup][requestCommand];
    if (!command) {
      raiseEasyException(
        `No command found for ${requestGroup}:${requestCommand}`,
        400,
      );
    }
    await request.loadBody();

    const content = await command.action(this, request.body);
    return content || {};
  }

  private async requestHandler(request: Request): Promise<Response> {
    const easyRequest = new EasyRequest(request);
    const easyResponse = new EasyResponse();
    if (easyRequest.method === "OPTIONS") {
      return easyResponse.respond();
    }
    if (easyRequest.upgradeSocket) {
      // TODO: Handle WebSocket Upgrade
      return easyResponse.error("WebSocket is not implemented", 501);
    }

    switch (easyRequest.path) {
      case "/api":
        easyResponse.content = await this.apiHandler(easyRequest);
        break;
      default:
        return await this.staticFileHandler.serveFile(easyRequest);
    }
    return easyResponse.respond();
  }
}
