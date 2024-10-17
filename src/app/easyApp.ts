import { EasyException, raiseEasyException } from "#/easyException.ts";
import { EasyRequest } from "#/app/easyRequest.ts";
import { EasyResponse } from "#/app/easyResponse.ts";

import { StaticFileHandler } from "#/staticFiles/staticFileHandler.ts";

import type { MiddleWare } from "#/middleware/middleware.ts";

import type { EasyPack, EasyPackInfo } from "#/package/easyPack.ts";
import { basePack } from "#/package/basePack/basePack.ts";
import { RealtimeServer } from "#/realtime/realtimeServer.ts";

import type {
  DocsActionGroup,
  DocsActionParam,
  EasyAction,
} from "#/actions/actionTypes.ts";
import type { BootAction, InitAction } from "#/types.ts";
import { easyLog } from "#/log/logging.ts";
import { asyncPause, getCoreCount } from "#/utils.ts";

import { ColorMe, type EasyCli, type MenuView } from "@vef/easy-cli";
import { MessageBroker } from "#/realtime/messageBroker.ts";
import type { RealtimeRoomDef } from "#/realtime/realtimeTypes.ts";
import { initAppConfig } from "#/appConfig/appConfig.ts";
import { EasyCache } from "#/cache/cache.ts";
import type { EasyAppConfig } from "#/appConfig/appConfigTypes.ts";
import { handleApi } from "#/api/apiHandler.ts";
import type { DBType } from "#orm/database/database.ts";
import { EasyOrm } from "#orm/orm.ts";
import type { EntityDefinition, SafeType } from "@vef/types";
import { OrmException } from "#orm/ormException.ts";
import { PgError } from "#orm/database/adapter/adapters/postgres/pgError.ts";

const config = await initAppConfig();
/**
 * The EasyApp class is the starting point for creating an Easy App.
 */
export class EasyApp {
  private hasError: boolean = false;
  private server?: Deno.HttpServer;
  config!: Required<EasyAppConfig<DBType>>;
  private staticFileHandler!: StaticFileHandler;
  private devStaticFileHandler!: StaticFileHandler;
  private middleware: Array<
    MiddleWare
  > = [];

  mode: "development" | "production" = "development";
  workers: Array<{
    path: string;
    name: string;
  }> = [];
  cache: EasyCache;
  workersMap: Record<string, Worker> = {};
  realtime: RealtimeServer = new RealtimeServer();
  packages: Array<EasyPackInfo> = [];
  private easyPacks: Array<EasyPack> = [];
  orm: EasyOrm;
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
    this.devStaticFileHandler = new StaticFileHandler(
      {
        staticFilesRoot:
          `${this.config.staticFilesOptions.staticFilesRoot}/../dev`,
        cache: this.config.staticFilesOptions.cache,
      },
    );
    this.cache = new EasyCache();
    this.realtime.onCache = (operation, data) => {
      switch (operation) {
        case "set":
          this.cache.set(data.table, data.id, data.value);
          break;
        case "delete":
          this.cache.delete(data.table, data.id);
          break;
        case "clear":
          this.cache.clear();
          break;
        case "setList":
          this.cache.setList(data.table, data.values);
          break;
        case "appendList":
          this.cache.appendList(data.table, data.values);
          break;
        case "deleteList":
          this.cache.deleteList(data.table);
          break;
        default:
          raiseEasyException(`Invalid cache operation: ${operation}`, 500);
      }
    };
    this.addEasyPack(basePack);
    // this.addEasyPack(authPack);
  }

  cacheGet(table: string, id: string): SafeType | undefined {
    return this.cache.get(table, id);
  }

  cacheGetList(table: string): Array<{ id: string; value: SafeType }> {
    const list = this.cache.getList(table);
    return list.filter((item) => item !== undefined) as Array<
      { id: string; value: SafeType }
    >;
  }
  cacheSet(table: string, id: string, value: SafeType): void {
    this.realtime.cache("set", { table, id, value });
    this.cache.set(table, id, value);
  }
  cacheDelete(table: string, id: string): void {
    this.realtime.cache("delete", { table, id });
    this.cache.delete(table, id);
  }
  cacheClear(): void {
    this.realtime.cache("clear", {});
    this.cache.clear();
  }
  cacheSetList(
    table: string,
    values: { id: string; value: SafeType }[],
  ): void {
    this.realtime.cache("setList", { table, values });
    this.cache.setList(table, values);
  }
  cacheAppendList(
    table: string,
    values: { id: string; value: SafeType }[],
  ): void {
    this.realtime.cache("appendList", { table, values });
    this.cache.appendList(table, values);
  }
  cacheDeleteList(table: string): void {
    this.realtime.cache("deleteList", { table });
    this.cache.deleteList(table);
  }

  async init(): Promise<void> {
    // this.actions = {};
    for (const action of this.initActions) {
      await action.action(this);
    }
  }
  get apiDocs(): DocsActionGroup[] {
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
    return this.actions[group][action]?.public ?? false;
  }

  /**
   * Add an action to the app
   */
  addAction(
    group: string,
    action: EasyAction,
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
  addActionGroup(group: string, actions: Array<EasyAction>) {
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
   * Add a middleware to the app
   */
  addMiddleware(
    middleware: MiddleWare,
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
          required: action.params[param].required || false,
          type: action.params[param].type,
        });
      }
      docs.actions.push({
        actionName: action.actionName,
        description: action.description,
        params,
        public: action.public,
        system: action.system,
        response: action.response,
      });
    }
    return docs;
  }

  /**
   * Get a list of all the registered entities and their properties
   */
  get entityInfo(): EntityDefinition[] {
    return Object.values(this.orm.entities);
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
        this.orm.addEntity(entity);
      }
      for (const settingsEntity of easyPack.settingsEntities) {
        this.orm.addSettingsEntity(settingsEntity);
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
      if (e instanceof Error) {
        e.message = `Error adding EasyPack: ${e.message}`;
      }
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

  async runAction(group: string, action: string, options: {
    data: Record<string, any>;
    request: EasyRequest;
    response: EasyResponse;
  }): Promise<Record<string, any> | void> {
    if (!this.actions[group]) {
      raiseEasyException(`Group ${group} not found`, 404);
    }
    const actionFunc = this.actions[group][action];
    if (!actionFunc) {
      raiseEasyException(`Action ${group}:${action} not found`, 404);
    }
    const content = await actionFunc.action(
      this,
      options.data,
      options.request,
      options.response,
    );
    if (typeof content === "string") {
      return {
        message: content,
      };
    }
    return content || {};
  }

  private runMessageBroker() {
    const broker = new MessageBroker(this.config.realtimeOptions.port);
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

    try {
      await this.boot();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      const errorClass = e instanceof Error ? e.constructor.name : "Unknown";
      easyLog.error(
        `Error booting app: ${message} (${errorClass})`,
        "Boot",
        {
          stack: e instanceof Error ? e.stack : undefined,
        },
      );

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
      if (e instanceof Error) {
        e.message = `Error initializing ORM: ${e.message}`;
      }
      throw e;
    }
    // this.bootWorkers();
    this.realtime.boot();
    try {
      for (const action of this.bootActions) {
        easyLog.info(
          `Running boot action ${
            ColorMe.fromOptions(action.actionName, {
              color: "brightCyan",
            })
          }`,
          "Boot",
        );
        await action.action(this);
      }
    } catch (e: unknown) {
      if (e instanceof EasyException) {
        e.message = `Error running boot action ${e.name}: ${e.message}`;
      }
      if (e instanceof Error) {
        e.message = `Error running boot action: ${e.message}`;
      }
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

    const serveOptions: Deno.ServeTcpOptions = {
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
        if (hostname === "0.0.0.0" || hostname === "::1") {
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
        const easyRequest = new EasyRequest(
          request,
          this.config.pathPrefix,
        );

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
              easyResponse.content = await handleApi(
                this,
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
            if (e.redirect) {
              return easyResponse.redirect(e.redirect);
            }
            return easyResponse.error(e.message, e.status, subject);
          }
          if (e instanceof PgError) {
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
          const subject = er.name;
          easyLog.info(er.stack, subject);
          easyLog.error(er.message, subject, {
            stack: er.stack,
          });
          return easyResponse.error(er.message, 500, subject);
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
    if (path.startsWith("/dev")) {
      path = path.replace("/dev", "");
      try {
        const file = await this.devStaticFileHandler.serveFile(path);
        return file;
      } catch (e) {
        if (e instanceof EasyException) {
          if (e.status === 404 && this.config.singlePageApp) {
            return await this.devStaticFileHandler.serveFile(
              "/index.html",
            );
          }
        }
        throw e;
      }
    }

    try {
      const file = await this.staticFileHandler.serveFile(path);
      return file;
    } catch (e) {
      if (e instanceof EasyException) {
        if (e.status === 404 && this.config.singlePageApp) {
          return await this.staticFileHandler.serveFile("/index.html");
        }
      }
      throw e;
    }
  }
}
