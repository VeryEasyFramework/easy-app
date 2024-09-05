import { EasyException, raiseEasyException } from "#/easyException.ts";
import { EasyRequest } from "#/easyRequest.ts";
import { EasyResponse } from "#/easyResponse.ts";

import {
  type DatabaseConfig,
  type DBType,
  type EasyFieldType,
  EasyOrm,
  type EntityDefinition,
  type Orm,
  OrmException,
} from "@vef/easy-orm";

import {
  StaticFileHandler,
  type StaticFilesOptions,
} from "#/staticFiles/staticFileHandler.ts";

import type {
  MiddlewareWithoutResponse,
  MiddlewareWithResponse,
} from "#/middleware/middleware.ts";

import type { EasyPack, EasyPackInfo } from "./package/easyPack.ts";
import { basePackage } from "#/package/basePack/basePack.ts";
import { RealtimeServer } from "#/realtime/realtimeServer.ts";

import type {
  Action,
  DocsActionGroup,
  DocsActionParam,
  EasyAction,
  InferredAction,
} from "#/actions/actionTypes.ts";
import type { BootAction, InitAction } from "#/types.ts";
import { easyLog } from "#/log/logging.ts";
import { asyncPause, getCoreCount, savePID } from "#/utils.ts";
import { PgError } from "@vef/easy-orm";
import { ColorMe, type EasyCli, MenuView } from "@vef/easy-cli";
import { MessageBroker } from "#/realtime/messageBroker.ts";
import type { RealtimeRoomDef } from "#/realtime/realtimeTypes.ts";
import { buildCli } from "#/package/basePack/boot/cli/cli.ts";
import { initAppConfig } from "#/appConfig/appConfig.ts";

export interface EasyAppOptions<D extends DBType> {
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
   * The file name of the main module for the app.
   *
   * For example `main.ts` or `app.ts`
   */
  mainModule?: string;
  /**
   * The name of the app. This is used in the logs and other places where the app name is needed.
   */

  appName?: string;
  /**
   * The path prefix for the app. This is useful when the app is running behind a reverse proxy.
   *
   * **Example:**
   * ```ts
   * const app = new EasyApp({
   * pathPrefix: "/myapp",
   * });
   * ```
   */
  pathPrefix?: string;

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
  serverOptions?: Deno.ServeOptions;

  /**
   * Options for the ORM
   *
   * **`databaseType`** - The type of database to use. Default: `denoKv`
   *
   * **`databaseConfig`** - The configuration object for the database
   */
  ormOptions?: {
    databaseType: keyof DatabaseConfig;
    databaseConfig: DatabaseConfig[keyof DatabaseConfig];
    idFieldType?: EasyFieldType;
  };
}

const config = await initAppConfig();
/**
 * The EasyApp class is the starting point for creating an Easy App.
 */
export class EasyApp {
  private hasError: boolean = false;
  private server?: Deno.HttpServer;
  config!: Required<EasyAppOptions<DBType>>;
  private staticFileHandler!: StaticFileHandler;
  private middleware: Array<
    MiddlewareWithResponse | MiddlewareWithoutResponse
  > = [];

  mode: "development" | "production" = "development";
  workers: Array<{
    path: string;
    name: string;
  }> = [];

  workersMap: Record<string, Worker> = {};
  realtime: RealtimeServer = new RealtimeServer();
  packages: Array<EasyPackInfo> = [];
  private easyPacks: Array<EasyPack> = [];
  orm: Orm;
  actions: Record<string, Record<string, EasyAction>>;
  requestTypes: string = "";

  /**
   * An array of boot actions that are run when the app is booted
   */
  bootActions: Array<BootAction> = [];

  initActions: Array<InitAction> = [];
  cliMenu!: MenuView;

  cli!: EasyCli;
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

  constructor() {
    this.config = config;
    this.actions = {};
    this.orm = new EasyOrm({
      databaseType: this.config.ormOptions.databaseType,
      databaseConfig: this.config.ormOptions.databaseConfig,
      idFieldType: this.config.ormOptions.idFieldType,
      entities: [],
    });

    this.staticFileHandler = new StaticFileHandler(
      this.config.staticFilesOptions,
    );

    this.addEasyPack(basePackage);
  }

  async init() {
    // this.actions = {};
    for (const action of this.initActions) {
      await action.action(this);
    }
  }
  private get apiDocs(): DocsActionGroup[] {
    const fullDocs: DocsActionGroup[] = [];
    for (const groupKey in this.actions) {
      const groupDocs = this.getActionGroupDocs(groupKey);
      fullDocs.push(groupDocs);
    }
    return fullDocs;
  }

  set mainModule(module: string) {
    let mainFile = "main.ts";
    let mainDir = module;
    if (module.endsWith(".ts")) {
      mainFile = module.split("/").pop() || "main.ts";
      mainDir = module.split("/").slice(0, -1).join("/");
    }
    this.config.appRootPath = mainDir.replace("file://", "");
    this.config.mainModule = mainFile;
  }

  /**
   * Send a realtime notification to a room
   */
  notify(
    room: string,
    event: string,
    data: Record<string, any>,
  ): void {
    this.realtime.notify(room, event, data);
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
      easyLog.error(
        `Action ${action.actionName} already exists in group ${group}`,
        "Add Action Error",
        {
          hideTrace: true,
        },
      );
      this.hasError = true;
      return;
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
  addRealtimeRooms(rooms: RealtimeRoomDef[]) {
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

  addWorker(name: string, path: string) {
    this.workers.push({ name, path });
    easyLog.info(`Worker ${name} at ${path} added`, "Worker");
    // Deno.exit(0);
    // const worker = new Worker(path, { type: "module", name: name });
    // if (!worker) {
    //   raiseEasyException(`Worker ${name} not found`, 404);
    // }
    // if (this.workers[name]) {
    //   raiseEasyException(`Worker ${name} already exists`, 500);
    // }
    // this.workers[name] = worker;
  }

  queryWorker(name: string, data: Record<string, any>) {
    const worker = this.workersMap[name];
    if (!worker) {
      raiseEasyException(`Worker ${name} not found`, 404);
    }
    worker.postMessage(data);
  }
  queueTask(taskName: string, params?: Record<string, any>) {
    this.queryWorker("task", { taskName, params });
  }
  /**
   * Add an EasyPack to the app
   */
  addEasyPack(easyPack: EasyPack): void {
    try {
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

      for (const bootAction of easyPack.bootActions) {
        this.addBootAction(bootAction);
      }
      for (const initAction of easyPack.initActions) {
        this.addInitAction(initAction);
      }
    } catch (e) {
      if (e instanceof EasyException) {
        const subject = `EasyPack Error: ${easyPack.easyPackInfo.EasyPackName}`;

        easyLog.error(e.message, subject, {
          hideTrace: true,
        });
        this.hasError = true;
        return;
      }
      e.message = `Error adding EasyPack: ${e.message}`;
      throw e;
    }
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

  private runMessageBroker() {
    const broker = new MessageBroker();
    broker.run();
  }

  startProcess(options?: {
    args?: string[];
    flags?: string[];
    signal?: AbortSignal;
  }): number {
    const cwd = Deno.cwd();

    const args = options?.args || [];
    const flags = options?.flags || [];

    if (
      this.orm.dbType === "denoKv" && !flags.includes("--unstable-kv")
    ) {
      flags.push("--unstable-kv");
    }
    if (args.includes("--prod")) {
      const platform = Deno.build.os;
      let bin = "./app";
      switch (platform) {
        case "windows":
          bin = "./app.exe";
          break;
        case "darwin":
          bin = "./appOsx";
          break;
        case "linux":
          bin = "./app";
          break;
        default:
          raiseEasyException(`Platform ${platform} not supported`, 500);
      }
      const cmd = new Deno.Command(bin, {
        args,
        cwd,
        signal: options?.signal,
      });
      const process = cmd.spawn();
      return process.pid;
    }
    const denoBin = Deno.execPath();
    const mainModule = "main.ts";
    const cmdArgs = [
      "run",
      "-A",
      "--unstable-net",
      ...flags,
      `${mainModule}`,
      ...args,
    ];

    const cmd = new Deno.Command(denoBin, {
      args: cmdArgs,
      cwd,
      signal: options?.signal,
    });

    const process = cmd.spawn();

    return process.pid;
  }

  async begin(
    options: { args: string[]; flags?: string[]; signal?: AbortSignal },
  ): Promise<void> {
    this.startProcess({
      args: ["broker", ...options.args],
      flags: options.flags,
      signal: options.signal,
    });
    const cores = await getCoreCount();
    const pids: number[] = [];
    for (let i = 0; i < cores; i++) {
      pids.push(
        this.startProcess({
          args: ["app", "-n", i.toString(), ...options.args],
          flags: options.flags,
          signal: options.signal,
        }),
      );
    }

    easyLog.info(`Started ${cores} app processes ${pids.join(", ")}`, "Boot");
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
    await this.init();
    if (this.hasError) {
      easyLog.warning("App has errors. Exiting...", "Boot", {
        hideTrace: true,
      });
      this.exit(1);
    }
    const args = Deno.args;
    const argsRecord: Record<string, any> = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "-n") {
        argsRecord.name = args[i + 1];
        i++;
        continue;
      }
      if (args[i] === "--prod") {
        argsRecord.prod = true;
        continue;
      }
      argsRecord[args[i]] = true;
    }

    if (argsRecord.broker) {
      this.runMessageBroker();
      return;
    }
    buildCli.action(this);
    try {
      await this.boot();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      const errorClass = e instanceof Error ? e.constructor.name : "Unknown";
      easyLog.error(`Error booting app: ${message} (${errorClass})`);

      this.exit(0);
    }

    if (argsRecord.app) {
      this.runApp({
        name: argsRecord.name,
        clientProxyPort: config?.clientProxyPort,
      });
      return;
    }
    if (argsRecord.serve) {
      await this.begin({ args });
      return;
    }

    this.cli.run();
    this.cli.changeView("main");
    return;
  }

  runApp(config?: {
    name?: string;
    clientProxyPort?: number;
  }) {
    this.serve({
      clientProxyPort: config?.clientProxyPort,
      name: config?.name,
    });
  }

  /**
   * Add a boot action to the app
   */
  addBootAction(bootAction: BootAction): void {
    this.bootActions.push(bootAction);
  }

  /**
   * Add an init action to the app
   */
  addInitAction(initAction: InitAction): void {
    this.initActions.push(initAction);
  }
  exit(code?: number): void {
    this.server?.shutdown();
    prompt("Press enter to exit...");
    Deno.exit(code);
  }

  private async boot(): Promise<void> {
    if (this.hasError) {
      easyLog.message("App has errors. Exiting...", "Boot");
      prompt("Press any key to exit...");
      this.exit(1);
    }
    console.clear();

    asyncPause(100);
    easyLog.info("Booting EasyApp...", "Boot");

    this.requestTypes = this.buildRequestTypes();
    try {
      await this.orm.init();
    } catch (e) {
      if (e instanceof OrmException) {
        easyLog.error(e.message, e.type, {
          hideTrace: true,
        });
        this.exit(1);
      }
      e.message = `Error initializing ORM: ${e.message}`;
      throw e;
    }
    // this.bootWorkers();
    this.realtime.boot();
    try {
      for (const action of this.bootActions) {
        easyLog.info(
          `Running boot action ${
            ColorMe.fromOptions(action.actionName, { color: "brightCyan" })
          }`,
          "Boot",
        );
        await action.action(this);
      }
    } catch (e) {
      e.message = `Error running boot action ${e.actionName}: ${e.message}`;
      throw e;
    }
  }
  stop() {
    this.server?.shutdown();
    this.realtime.stop();
    this.orm.stop();
  }
  private serve(config?: {
    clientProxyPort?: number;
    name?: string;
  }): void {
    const options = this.config.serverOptions;

    const serveOptions: Deno.ServeOptions = {
      hostname: options.hostname,
      port: options.port,
      reusePort: options.reusePort || true,

      onListen: (addr) => {
        const { hostname, port, transport } = addr;
        let protocol = "";
        let host = hostname;
        if (transport === "tcp") {
          protocol = "http";
        }
        if (hostname === "0.0.0.0") {
          host = "localhost";
        }
        const message = ColorMe.chain().content("EasyApp")
          .color("brightCyan")
          .content(" is running on ")
          .color("brightWhite")
          .content(` ${protocol}://${host}:${port}`)
          .color("brightYellow")
          .end();
        easyLog.info(
          message,
          `Server (${this.config.appName}${
            config?.name ? ` - ${config.name}` : ""
          })`,
        );
      },
    };
    this.server = Deno.serve(
      serveOptions,
      async (request: Request): Promise<Response> => {
        const easyRequest = new EasyRequest(request, this.config.pathPrefix);

        const easyResponse = new EasyResponse();

        try {
          for (const middleware of this.middleware) {
            await middleware(this, easyRequest, easyResponse);
          }
          if (easyRequest.method === "OPTIONS") {
            return easyResponse.respond();
          }
          if (easyRequest.upgradeSocket) {
            return this.realtime.handleUpgrade(easyRequest);
          }
          switch (easyRequest.path) {
            case "/api":
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
        } catch (e) {
          if (e instanceof EasyException) {
            const subject = `${e.status} - ${e.name}`;
            easyLog.error(e.message, subject, {
              hideTrace: true,
            });
            return easyResponse.error(e.message, e.status, subject);
          }
          if (e instanceof PgError) {
            e.fullMessage;
            e.name;
            e.detail;

            // const subject = toTitleCase(e.name);
            const subject = e.name;
            const message = `${subject}: ${e.message}`;
            easyLog.error(message, "Database Error (Postgres)", {
              hideTrace: true,
            });
            return easyResponse.error(message, 500, subject);
          }
          if (e instanceof OrmException) {
            // const subject = toTitleCase(e.type);
            const message = `${e.type}: ${e.message}`;
            easyLog.error(message, "ORM Error", {
              hideTrace: true,
            });
            return easyResponse.error(message, 500, e.type);
          }
          const er = e as Error;
          const subject = e.name;
          easyLog.info(er.stack, subject);
          easyLog.error(e.message, subject, {
            stack: er.stack,
          });
          return easyResponse.error(e.message, 500, subject);
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
      const url = easyRequest.cleanedUrl.replace(
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
    const file = await this.staticFileHandler.serveFile(path);
    return file;
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
