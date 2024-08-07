import { EasyException, raiseEasyException } from "#/easyException.ts";
import { EasyRequest } from "#/easyRequest.ts";
import { EasyResponse } from "#/easyResponse.ts";

import { EasyOrm, type Orm } from "@vef/easy-orm";
import {
  StaticFileHandler,
  type StaticFilesOptions,
} from "#/staticFiles/staticFileHandler.ts";
import type { Action, InferredAction } from "./actions/createAction.ts";

import type {
  MiddlewareWithoutResponse,
  MiddlewareWithResponse,
} from "#/middleware/middleware.ts";

import type { EasyPackage, PackageInfo } from "#/package/easyPackage.ts";
import { basePackage } from "#/package/basePackage/basePackage.ts";
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

  packages: Array<PackageInfo> = [];
  orm: EasyOrm<any, any, any, any, any>;
  actions: Record<string, Record<string, any>>;
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
  get apiDocs(): any {
    const fullDocs: any[] = [];
    for (const groupKey in this.actions) {
      const groupDocs = this.getActionDocs(groupKey);
      fullDocs.push(groupDocs);
    }
    return fullDocs as any;
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
    if (this.actions[group][action.name as string]) {
      raiseEasyException(
        `Action ${action.name} already exists in group ${group}`,
        500,
      );
    }
    this.actions[group][action.name as string] = action;
  }
  addActionGroup(group: string, actions: Array<Action<any, any>>) {
    for (const action of actions) {
      this.addAction(group, action);
    }
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
  private getActionDocs(groupName: string): {
    name: string;
    actions: Record<string, any>;
  } {
    const group = this.actions[groupName];
    const docs = {
      name: groupName,
      actions: {},
    };
    for (const key in group) {
      const action = group[key] as any;
      docs.actions = {
        ...docs.actions,
        [key]: {
          description: action.description,
          params: action.params,

          response: action.response,
        },
      };
    }
    return docs;
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
    this.packages.push(easyPackage.packageInfo);
  }

  private buildRequestTypes(): string {
    const data = this.apiDocs;
    let typeString = `type  RequestMap = RequestStructure<{`;
    for (const group of data) {
      typeString += `\n  ${group.name}: {`;
      for (const action in group.actions) {
        const actionData = group.actions[action];
        typeString += `\n    ${action}: {`;
        typeString += `\n      params: {`;
        for (const param in actionData.params) {
          const paramData = actionData.params[param];
          typeString += `\n        ${param}${
            paramData.required ? "" : "?"
          }: FieldTypes["${paramData.type}"]`;
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
          // TODO: Handle WebSocket Upgrade
          return easyResponse.error("WebSocket is not implemented", 501);
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
      return this.getActionDocs(requestGroup);
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
    return content || {};
  }
}
