import { EasyException, raiseEasyException } from "#/easyException.ts";
import { EasyRequest } from "#/easyRequest.ts";
import { EasyResponse } from "#/easyResponse.ts";

import { EasyOrm, type EntityDefinition, type Orm } from "@vef/easy-orm";

import {
  StaticFileHandler,
  type StaticFilesOptions,
} from "#/staticFiles/staticFileHandler.ts";

import type {
  MiddlewareWithoutResponse,
  MiddlewareWithResponse,
} from "#/middleware/middleware.ts";

import type { EasyPack, EasyPackInfo } from "./package/easyPack.ts";
import { basePackage } from "./package/basePack/basePack.ts";
import {
  dispatchSocketEvent,
  RealtimeServer,
  type SocketRoomDef,
} from "#/realtime/realtimeServer.ts";
import type {
  Action,
  DocsActionGroup,
  DocsActionParam,
  EasyAction,
  InferredAction,
} from "#/actions/actionTypes.ts";
import type { BootAction } from "#/types.ts";
import { easyLog } from "#/log/logging.ts";
import { printUtils } from "@vef/easy-cli";
import { asyncPause } from "#/utils.ts";
import { colorMe } from "@vef/color-me";
import { OrmException } from "../../easy-orm/src/ormException.ts";

interface EasyAppOptions {
  /**
   * The root path of the app. Defaults to the current directory.
   * This is used to serve static files and to store the database file for
   * the ORM when using the default database type {json}.
   *
   * > **Note:** This path should be an absolute path.
   *
   * > **Note:** Use the forward slash `/` as the path separator even on Windows.
   *  The app will handle the path correctly.
   * ```ts
   * const app = new EasyApp({
   *  appRootPath: "/path/to/app/root",
   * });
   * ```
   */
  appRootPath?: string;

  /**
   * Set to true if the app is a single page app (SPA)
   * that has a single entry point.
   *
   * This will serve the index.html file for all requests that are not files.
   */
  singlePageApp?: boolean;

  /**
   * Options for the static files handler
   *
   * **`cache`** - Whether to cache files or not. Default: `true`
   *
   * **`staticFilesRoot`** - The root directory of the static files.
   */
  staticFilesOptions?: StaticFilesOptions;

  /**
   * Options for the Deno server
   *
   * **`port`** - The port to run the server on. Default: `8000`
   *
   * **`hostname`** - The hostname to run the server on. Default: `
   */
  serverOptions?: Deno.ListenOptions;
  /**
   * An instance of EasyOrm to use for the app. If not provided, a new instance
   * of EasyOrm will be created with the default options for the database type {json}.
   *
   * **Example:**
   * ```ts
   * const app = new EasyApp({
   *    orm: new EasyOrm({
   *      databaseType: "postgres",
   *      databaseConfig: {
   *        host: "localhost",
   *        port: 5432,
   *        user: "user",
   *        password: "password",
   *        database: "mydb",
   *      },
   *      entities: [],
   *   }),
   *  });
   * ```
   */
  orm?: Orm;
}

/**
 * The EasyApp class is the starting point for creating an Easy App.
 */
export class EasyApp {
  private server?: Deno.HttpServer;
  private config: Required<Omit<EasyAppOptions, "orm">>;
  private staticFileHandler: StaticFileHandler;
  private middleware: Array<
    MiddlewareWithResponse | MiddlewareWithoutResponse
  > = [];

  realtime: RealtimeServer = new RealtimeServer();
  packages: Array<EasyPackInfo> = [];
  orm: Orm;
  actions: Record<string, Record<string, EasyAction>>;
  requestTypes: string = "";

  /**
   * An array of boot actions that are run when the app is booted
   */
  bootActions: Array<BootAction> = [];

  /**
   * The starting point for the creating an Easy App
   *
   * **Quick Start:**
   *
   * ```ts
   * import { EasyApp } from "@vef/easy-app";
   * // Create a new instance of EasyApp
   * const app = new EasyApp();
   *  // Run the app
   * app.run();
   *
   * ```
   * Now you can visit http://localhost:8000 to see your app in action!
   *
   * Alternatively, you can pass in options to the EasyApp constructor:
   * ```ts
   * const app = new EasyApp(options: EasyAppOptions);
   * ```
   * - **`appRootPath`** (optional) - The root path of the app
   * - **`singlePageApp`** (optional) - Set to true if the app is a single page app (SPA)
   * - **`staticFilesOptions`** (optional) - Options for serving static files
   * - **`serverOptions`** (optional) - Options for the Deno server
   * - **`orm`** (optional) - An instance of EasyOrm to use for the app
   */
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
    this.addEasyPack(basePackage);
  }
  private get apiDocs(): DocsActionGroup[] {
    const fullDocs: DocsActionGroup[] = [];
    for (const groupKey in this.actions) {
      const groupDocs = this.getActionGroupDocs(groupKey);
      fullDocs.push(groupDocs);
    }
    return fullDocs;
  }

  /**
   * Send a realtime notification to a room
   */
  notify(
    room: string,
    event: string,
    data: Record<string, any>,
  ): void {
    dispatchSocketEvent(room, event, data);
  }

  /**
   * Check if an action is a public action  (does not require authentication)
   * This is useful for authorization middleware that needs to determine if an action is allowed
   * without the user being authenticated.
   */
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

  /**
   * Add an action to the app
   */
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

  /**
   * Add a group of actions to the app
   */
  addActionGroup(group: string, actions: Array<Action<any, any>>) {
    for (const action of actions) {
      this.addAction(group, action);
    }
  }

  /**
   * Add a list of rooms to the realtime server
   */
  addSocketRooms(rooms: SocketRoomDef[]) {
    this.realtime.addRooms(rooms);
  }

  /**
   * Add a middleware to the app that does not return a response
   */
  addMiddleware(middleware: MiddlewareWithoutResponse): void;

  /**
   * Add a middleware to the app that returns a response
   */
  addMiddleware(middleware: MiddlewareWithResponse): void;

  /**
   * Add a middleware to the app
   */
  addMiddleware(
    middleware: MiddlewareWithResponse | MiddlewareWithoutResponse,
  ): void {
    this.middleware.push(middleware);
  }

  /**
   *  Get the documentation for a specific group of actions
   */
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

  /**
   * Get a list of all the registered entities and their properties
   */
  get entityInfo(): EntityDefinition[] {
    return this.orm.entityInfo;
  }

  /**
   * Add an EasyPack to the app
   */
  addEasyPack(easyPack: EasyPack): void {
    for (const group in easyPack.actionGroups) {
      if (this.actions[group]) {
        raiseEasyException(`Group ${group} already exists`, 500);
      }
      this.addActionGroup(group, easyPack.actionGroups[group]);
    }
    for (const middleware of easyPack.middleware) {
      this.addMiddleware(middleware as any);
    }
    for (const entity of easyPack.entities) {
      if (this.orm.hasEntity(entity.entityId)) {
        raiseEasyException(`Entity ${entity.entityId} already exists`, 500);
      }
      this.orm.addEntity(entity);
    }
    for (const room of easyPack.realtimeRooms) {
      this.realtime.addRoom(room);
    }
    this.packages.push(easyPack.easyPackInfo);
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

  /**
   * This is the main entry point for the app. It boots the app and starts the server.
   *
   * You can pass in a configuration object to change the static files behavior to act as a reverse proxy.
   *
   * This is useful when developing a frontend that's running on a different port during development such as `vite` or `create-react-app`.
   *
   * **Example:**
   * ```ts
   * app.run({
   *  clientProxyPort: 3000,
   * });
   * ```
   */
  async run(config?: {
    clientProxyPort?: number;
  }): Promise<void> {
    try {
      await this.boot();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      const errorClass = e instanceof Error ? e.constructor.name : "Unknown";
      easyLog.error(`Error booting app: ${message} (${errorClass})`);

      this.exit(1);
    }
    this.serve(config);
  }

  addBootAction(actionName: string, action: () => Promise<void>): void;
  addBootAction(
    actionName: string,
    action: (app: EasyApp) => Promise<void>,
  ): void {
    this.bootActions.push({
      actionName,
      action: async () => {
        await action(this);
      },
    });
  }
  exit(code?: number): void {
    this.server?.shutdown();
    Deno.exit(code);
  }
  private async boot(): Promise<void> {
    console.clear();

    asyncPause(100);
    easyLog.info("Booting EasyApp...", "Boot");
    this.requestTypes = this.buildRequestTypes();
    try {
      await this.orm.init();
    } catch (e) {
      if (e instanceof OrmException) {
        easyLog.error(e.message, e.type, true);
        this.exit(1);
      }
      e.message = `Error initializing ORM: ${e.message}`;
      throw e;
    }
    try {
      for (const action of this.bootActions) {
        await action.action();
      }
    } catch (e) {
      e.message = `Error running boot action ${e.actionName}: ${e.message}`;
      throw e;
    }
  }
  private serve(config?: {
    clientProxyPort?: number;
  }): void {
    const options = this.config.serverOptions;

    const serveOptions: Deno.ServeOptions = {
      hostname: options.hostname,
      port: options.port,

      onListen: (addr) => {
        const { hostname, port, transport } = addr;
        let protocol = "";
        let host = "";
        if (transport === "tcp") {
          protocol = "http";
        }
        if (hostname === "0.0.0.0") {
          host = "localhost";
        }
        easyLog.info(
          `${colorMe.brightCyan("EasyApp")} is running on ${
            colorMe.brightYellow(` ${protocol}://${host}:${port}`)
          }`,
          "Server",
        );
      },
    };
    this.server = Deno.serve(
      serveOptions,
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
        } catch (_e) {
          if (_e instanceof EasyException) {
            const subject = `${_e.status} - ${_e.name}`;
            easyLog.error(_e.message, subject, true);
            return easyResponse.error(_e.message, _e.status);
          }

          const subject = _e.name;
          easyLog.error(_e.message, subject);
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
