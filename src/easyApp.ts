import { EasyException, raiseEasyException } from "#/easyException.ts";
import { EasyRequest } from "#/easyRequest.ts";
import { EasyResponse } from "#/easyResponse.ts";
import { StaticFileHandler } from "#/staticFiles/staticFileHandler.ts";
import { joinPath } from "#/utils.ts";
import { Action, InferredAction } from "#/createAction.ts";
interface EasyAppOptions {
  appRootPath?: string;
  staticFileRoot?: string;
  singlePageApp?: boolean;
  serverOptions?: Deno.ListenOptions;
}
export class EasyApp {
  private server?: Deno.HttpServer;
  private config: Required<EasyAppOptions>;
  private staticFileHandler: StaticFileHandler;
  actions: Record<string, Record<string, any>>;
  constructor(options: EasyAppOptions) {
    const appRootPath = Deno.realPathSync(options.appRootPath || Deno.cwd());
    this.config = {
      appRootPath,
      staticFileRoot: joinPath(
        appRootPath,
        options.staticFileRoot || "public",
      ),
      singlePageApp: options.singlePageApp || false,
      serverOptions: options.serverOptions || { port: 8000 },
    };

    this.staticFileHandler = new StaticFileHandler(this.config.staticFileRoot);
    this.actions = {};
  }

  addAction<A extends Action>(group: string, action: InferredAction<A>) {
    if (!this.actions[group]) {
      this.actions[group] = {};
    }
    this.actions[group][action.name as string] = action;
  }
  run() {
    this.serve();
  }
  private serve() {
    const options = this.config.serverOptions;
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
            default: {
              let path = easyRequest.path;
              if (this.config.singlePageApp && !easyRequest.isFile) {
                path = "/index.html";
              }
              return await this.staticFileHandler.serveFile(path);
            }
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
  private async apiHandler(request: EasyRequest): Promise<Record<string, any>> {
    if (!request.group) {
      raiseEasyException("No group specified", 400);
    }
    const requestGroup = request.group;
    const requestAction = request.action;
    if (!requestAction) {
      raiseEasyException(
        `No action specified for group: ${requestGroup}`,
        400,
      );
    }
    if (!this.actions[requestGroup]) {
      raiseEasyException(`No group found for ${requestGroup}`, 404);
    }

    if (!this.actions[requestGroup][requestAction]) {
      raiseEasyException(
        `No action found for ${requestGroup}:${requestAction}`,
        404,
      );
    }
    const action = this.actions[requestGroup][requestAction];

    await request.loadBody();

    const content = await action.action(this, request.body);
    return content || {};
  }
}
