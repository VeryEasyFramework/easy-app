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

import { ColorMe, type EasyCli, type MenuView } from "@vef/easy-cli";

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
import { authPack } from "#/package/authPack/authPack.ts";
import { emailPack } from "#/package/emailPack/emailPack.ts";
import appRunner from "#/app/runner/mod.ts";
import { workersPack } from "#/package/workers/workersPack.ts";
import type { SettingsEntityDefinition } from "@vef/types";
import type { AppProcess } from "#/app/runner/begin.ts";

const config = await initAppConfig();
/**
 * The EasyApp class is the starting point for creating an Easy App.
 */
export class EasyApp {
  private hasError: boolean = false;
  server?: Deno.HttpServer;
  config!: Required<EasyAppConfig<DBType>>;
  processNumber: string = "Main";

  get fullAppName(): string {
    return `${this.config.appName} (${this.processNumber})`;
  }
  private staticFileHandler!: StaticFileHandler;
  private devStaticFileHandler!: StaticFileHandler;
  private middleware: Array<
    MiddleWare
  > = [];

  mode: "development" | "production" = "development";

  workerMode: "short" | "medium" | "long" | undefined;

  cache: EasyCache;
  realtime: RealtimeServer = new RealtimeServer();
  packages: Array<EasyPackInfo> = [];
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
   * Install the Easy App package:
   * ```shell
   *
   * deno add jsr:@vef/easy-app
   *
   * ```
   *
   * Create a new instance of EasyApp and run the app:
   *
   * ```ts
   * import { EasyApp } from "@vef/easy-app";
   * // Create a new instance of EasyApp
   * const app = new EasyApp();
   *  // Run the app
   *
   * app.run();
   *
   * ```
   * Now you can visit http://localhost:8000 to see your app in action!
   */

  constructor() {
    this.config = config;
    this.actions = {};
    this.orm = new EasyOrm({
      databaseType: this.config.ormOptions.databaseType,
      app: this,
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

    config.easyPacks.forEach((pack) => {
      switch (pack) {
        case "authPack":
          this.addEasyPack(authPack);
          break;
        case "emailPack":
          this.addEasyPack(emailPack);
          break;
        case "workersPack":
          this.addEasyPack(workersPack);
          break;
        default:
          raiseEasyException(`Unknown EasyPack: ${pack}`, 500);
      }
    });
  }
  processes: Array<AppProcess> = [];

  /**
   * Get an item from the in-memory cache.
   * The cache is shared across all instances of the app and is not persisted.
   * @param table The table to get the list from
   * @param id The id of the item to get
   * @returns The item from the cache
   */
  cacheGet<T = SafeType>(table: string, id: string): T | undefined {
    return this.cache.get<T>(table, id);
  }

  /**
   * Get a list of items from the in-memory cache.
   * The cache is shared across all instances of the app and is not persisted.
   * @param table The table to get the list from
   * @returns An array of items in the list
   */
  cacheGetList<T = SafeType>(table: string): Array<{ id: string; value: T }> {
    const list = this.cache.getList<T>(table);
    return list.filter((item) => item !== undefined) as Array<
      { id: string; value: T }
    >;
  }
  /**
   * Set an item in the in-memory cache. This will sync the cache across all instances of the app.
   * @param table The table to store the item in
   * @param id The id of the item used to retrieve it later
   * @param value The value to store
   */
  cacheSet(table: string, id: string, value: SafeType): void {
    this.realtime.cache("set", { table, id, value });
    this.cache.set(table, id, value);
  }

  /**
   * Delete an item from the in-memory cache. This will delete the item from all instances of the app.
   * @param table
   * @param id
   */
  cacheDelete(table: string, id: string): void {
    this.realtime.cache("delete", { table, id });
    this.cache.delete(table, id);
  }

  /**
   * Clear the in-memory cache. This will delete all items from the cache across all instances of the app.
   */
  cacheClear(): void {
    this.realtime.cache("clear", {});
    this.cache.clear();
  }

  /**
   * Add items to an existing list. If the list doesn't exist, it will create a new one.
   * @param table The table to store the list in
   * @param values The items to add to the list
   * @returns void
   */
  cacheSetList(
    table: string,
    values: { id: string; value: SafeType }[],
  ): void {
    this.realtime.cache("setList", { table, values });
    this.cache.setList(table, values);
  }

  /**
   * Replace an existing list with new items. Deletes all existing items in the list!
   * If there's no existing list, it will create a new one.
   * @param table The table to store the list in
   * @param values The items to add to the list
   */
  cacheAppendList(
    table: string,
    values: { id: string; value: SafeType }[],
  ): void {
    this.realtime.cache("appendList", { table, values });
    this.cache.appendList(table, values);
  }

  /**
   * Delete a list from the cache. This will delete the list from all instances of the app.
   * @param table The table to delete the list from
   */
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

  get settingsInfo(): SettingsEntityDefinition[] {
    return Object.values(this.orm.settingsDefinitions);
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
    appRunner(this, Deno.args);
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
  exit(code?: number, wait?: boolean): void {
    this.server?.shutdown();
    this.processes.forEach((appProcess) => {
      try {
        appProcess.process.kill("SIGTERM");
        easyLog.info(
          `Stopped ${appProcess.name} (${appProcess.process.pid})`,
          "Shutdown",
          {
            compact: true,
          },
        );
      } catch (e) {
        if (e instanceof Deno.errors.NotFound) {
          easyLog.warning(
            `Process ${appProcess.name} (${appProcess.process.pid}) not found`,
            `${this.fullAppName}`,
            {
              compact: true,
            },
          );
        }
      }
    });
    if (wait) {
      prompt("Press enter to exit...");
    }
    Deno.exit(code);
  }

  async boot(): Promise<void> {
    if (this.hasError) {
      easyLog.message("App has errors. Exiting...", "Boot");
      prompt("Press any key to exit...");
      this.exit(1);
    }

    // asyncPause(100);
    // easyLog.info("Booting EasyApp...", this.fullAppName, { compact: true });

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
    this.realtime.appId = this.processNumber;
    this.realtime.boot();
    try {
      for (const action of this.bootActions) {
        // easyLog.info(
        //   `Running boot action ${
        //     ColorMe.fromOptions(action.actionName, {
        //       color: "brightCyan",
        //     })
        //   }`,
        //   "Boot",
        // );
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
  serve(config?: {
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
        const message = ColorMe.chain().content(this.fullAppName)
          .color("brightCyan")
          .content(" is running on ")
          .color("brightWhite")
          .content(` ${protocol}://${host}:${port}`)
          .color("brightYellow")
          .end();
        easyLog.info(
          message,
          "Serve",
          {
            compact: true,
          },
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

      return await fetch(url);
    }
    let path = easyRequest.path;
    if (path.startsWith("/dev")) {
      path = path.replace("/dev", "");
      try {
        return await this.devStaticFileHandler.serveFile(path);
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
      return await this.staticFileHandler.serveFile(path);
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
