import { EasyException, raiseEasyException } from "#/easyException.ts";
import { EasyRequest } from "#/easyRequest.ts";
import { EasyResponse } from "#/easyResponse.ts";

import { EasyOrm, type Orm } from "@vef/easy-orm";
import {
  StaticFileHandler,
  type StaticFilesOptions,
} from "#/staticFiles/staticFileHandler.ts";

import type {
  MiddlewareWithoutResponse,
  MiddlewareWithResponse,
} from "#/middleware/middleware.ts";

import type { EasyPackage, PackageInfo } from "#/package/easyPackage.ts";
import { basePackage } from "#/package/basePackage/basePackage.ts";
import {
  dispatchSocketEvent,
  RealtimeServer,
  type SocketRoomDef,
} from "#/realtime/realtimeServer.ts";
import type {
  Action,
  DocsAction,
  DocsActionGroup,
  DocsActionParam,
  EasyAction,
  InferredAction,
} from "#/actions/actionTypes.ts";
interface EasyAppOptions {
  appRootPath?: string;
  singlePageApp?: boolean;
  staticFilesOptions?: StaticFilesOptions;
  serverOptions?: Deno.ListenOptions;
  orm?: Orm;
}

export class EasyApp {
  private server?: Deno.HttpServer;
  private config: Required<Omit<EasyAppOptions, "orm">>;
  private staticFileHandler: StaticFileHandler;
  private middleware: Array<
    MiddlewareWithResponse | MiddlewareWithoutResponse
  > = [];

  realtime: RealtimeServer = new RealtimeServer();
  packages: Array<PackageInfo> = [];
  orm: Orm;
  actions: Record<string, Record<string, EasyAction>>;
  requestTypes: string = "";
  constructor(options?: EasyAppOptions) {
    const appRootPath = options?.appRootPath || ".";
    this.orm = options?.orm || new EasyOrm({
      databaseType: "json",
      databaseConfig: {
        dataPath: `${appRootPath}/.data`,
      },
      entities: [],
    });
    this.config = {
      appRootPath,
      staticFilesOptions: {
        staticFilesRoot: options?.staticFilesOptions?.staticFilesRoot ||
          "public",
        cache: options?.staticFilesOptions?.cache || false,
      },
      singlePageApp: options?.singlePageApp || false,
      serverOptions: options?.serverOptions || { port: 8000 },
    };

    this.staticFileHandler = new StaticFileHandler(
      this.config.staticFilesOptions,
    );
    this.actions = {};
    this.addPackage(basePackage);
  }
  private get apiDocs(): DocsActionGroup[] {
    const fullDocs: DocsActionGroup[] = [];
    for (const groupKey in this.actions) {
      const groupDocs = this.getActionGroupDocs(groupKey);
      fullDocs.push(groupDocs);
    }
    return fullDocs;
  }
  notify(
    room: string,
    event: string,
    data: Record<string, any>,
  ): void {
    dispatchSocketEvent(room, event, data);
  }
  isPublicAction(group?: string, action?: string): boolean {
    if (!group || !action) {
      return false;
    }
    if (!this.actions[group]) {
      return false;
    }
    const actionInfo = this.actions[group][action];
    return actionInfo.public || false;
  }
  addAction<A extends Action<any, any>>(
    group: string,
    action: InferredAction<A>,
  ) {
    if (!this.actions[group]) {
      this.actions[group] = {};
    }
    if (this.actions[group][action.actionName as string]) {
      raiseEasyException(
        `Action ${action.actionName} already exists in group ${group}`,
        500,
      );
    }
    this.actions[group][action.actionName as string] = action;
  }
  addActionGroup(group: string, actions: Array<Action<any, any>>) {
    for (const action of actions) {
      this.addAction(group, action);
    }
  }

  addSocketRooms(rooms: SocketRoomDef[]) {
    this.realtime.addRooms(rooms);
  }
  // Overload signatures for addMiddleware
  addMiddleware(middleware: MiddlewareWithoutResponse): void;
  addMiddleware(middleware: MiddlewareWithResponse): void;

  // Implementation of addMiddleware
  addMiddleware(
    middleware: MiddlewareWithResponse | MiddlewareWithoutResponse,
  ): void {
    this.middleware.push(middleware);
  }
  getActionGroupDocs(groupName: string): DocsActionGroup {
    const group = this.actions[groupName];
    const docs: DocsActionGroup = {
      groupName,
      actions: [],
    };
    for (const key in group) {
      const action = group[key];
      const params: DocsActionParam[] = [];
      for (const param in action.params) {
        params.push({
          paramName: param,
          required: action.params[param].required,
          type: action.params[param].type,
        });
      }
      docs.actions.push({
        actionName: action.actionName,
        description: action.description,
        params,
        public: action.public,
        response: action.response,
      });
    }
    return docs;
  }

  get entityInfo() {
    return this.orm.entityInfo;
  }
  addPackage(easyPackage: EasyPackage): void {
    for (const group in easyPackage.actionGroups) {
      if (this.actions[group]) {
        raiseEasyException(`Group ${group} already exists`, 500);
      }
      this.addActionGroup(group, easyPackage.actionGroups[group]);
    }
    for (const middleware of easyPackage.middleware) {
      this.addMiddleware(middleware as any);
    }
    for (const entity of easyPackage.entities) {
      if (this.orm.hasEntity(entity.entityId)) {
        raiseEasyException(`Entity ${entity.entityId} already exists`, 500);
      }
      this.orm.addEntity(entity);
    }
    for (const room of easyPackage.realtimeRooms) {
      this.realtime.addRoom(room);
    }
    this.packages.push(easyPackage.packageInfo);
  }

  private buildRequestTypes(): string {
    const data = this.apiDocs;
    let typeString = `type  RequestMap = RequestStructure<{`;
    for (const group of data) {
      typeString += `\n  ${group.groupName}: {`;
      for (const action in group.actions) {
        const actionData = group.actions[action];
        typeString += `\n    ${action}: {`;
        typeString += `\n      params: {`;
        if (actionData.params) {
          for (const param of actionData.params) {
            const paramData = param;
            typeString += `\n        ${param}${
              paramData.required ? "" : "?"
            }: FieldTypes["${paramData.type}"]`;
          }
        }
        typeString += `\n      },`;
        typeString += `\n      response: ${actionData.response || "void"}`;
        typeString += `\n    },`;
      }
      typeString += `\n  },`;
    }
    typeString += `}>\n\n `;
    return typeString;
  }
  async run(config?: {
    clientProxyPort?: number;
  }): Promise<void> {
    await this.boot();
    this.serve(config);
  }
  private async boot(): Promise<void> {
    this.requestTypes = this.buildRequestTypes();
    await this.orm.init();
  }
  private serve(config?: {
    clientProxyPort?: number;
  }): void {
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
          return this.realtime.handleUpgrade(easyRequest.request);
        }
        try {
          switch (easyRequest.path) {
            case "/api":
              for (const middleware of this.middleware) {
                await middleware(this, easyRequest, easyResponse);
              }
              easyResponse.content = await this.apiHandler(
                easyRequest,
                easyResponse,
              );
              break;
            default:
              return await this.clientHandler(
                easyRequest,
                config?.clientProxyPort,
              );
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
  private async clientHandler(easyRequest: EasyRequest, proxy?: number) {
    if (proxy) {
      const port = easyRequest.port?.toString();
      if (!port) {
        raiseEasyException("Port not found for client proxy", 500);
      }
      const url = easyRequest.request.url.replace(
        port,
        proxy.toString(),
      );
      const response = await fetch(url);
      return response;
    }
    let path = easyRequest.path;
    if (this.config.singlePageApp && !easyRequest.isFile) {
      path = "/index.html";
    }
    return await this.staticFileHandler.serveFile(path);
  }
  private async apiHandler(
    request: EasyRequest,
    response: EasyResponse,
  ): Promise<Record<string, any>> {
    if (!request.group) {
      return this.apiDocs;
    }
    const requestGroup = request.group;
    const requestAction = request.action;
    if (!requestAction) {
      return this.getActionGroupDocs(requestGroup);
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

    const content = await action.action(this, request.body, response);
    if (typeof content === "string") {
      return {
        message: content,
      };
    }
    return content || {};
  }
}
