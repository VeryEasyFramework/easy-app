import {FieldTypeMap, IRLModel} from "../model/modelTypes.ts";
import {KVRecord} from "../types/utilities.ts";
import {asyncPause, formatter} from "../utilities.ts";
import {SocketRoomDef, SocketServer} from "../realtime/websocket.ts";
import {CliMenu} from "../cli/cliMenu.ts";
import {IrlCli} from "../cli/irlCli.ts";
import {CliPrompter} from "../cli/prompter.ts";
import {IRLException, raiseIRLException} from "../exceptions/exceptions.ts";
import {colorMe, irLog} from "../logging/index.ts";
import {IRLRequest} from "./irlRequest.ts";
import {IRLResponse} from "./irlResponse.ts";
import {IRLDB} from "../database/IrlDB.ts";
import {IRLDBAdapter} from "../database/dbTypes.ts";
import {ModelLoader} from "../model/modelLoader.ts";
import {AppConfig, AppConfigLoader} from "../config-utils/appConfig.ts";

import {AppFactory} from "./appFactory.ts";
import {joinPath} from "../utils/pathHelpers.ts";
import {handleFileRequest} from "../../src/staticFiles/staticFileHandler.ts";
import {MemcachePool} from "../../wip/cache/main.ts";


type ApiGroup = {
    group: string;
    commands: {
        [key: string]: {
            description: string;
            params: Record<string, any>;
            response: any;
        };
    };
};

interface GlobalTypes {
    appName: string;
    socketServer: SocketServer;
    server: {
        host: string;
        port: number;
    };
    docs: ApiGroup[];
    db: IRLDB;
    requestTypes: string;
    localCtx: Map<string, any>;
    publicActions: { group: string; command: string }[];
}

export type App = IRLApp<string, KVRecord<any>>;

/**
 * @class IRLApp
 * @description IRLApp is a class that represents an IRL application and provides a way to define routes and boot actions
 */
export class IRLApp<Id extends string, G extends KVRecord<G>> {
    appName: string;
    appRootPath: string;
    publicFileRoot: string;
    cache: MemcachePool;
    globals: G;
    db: IRLDB;
    publicActions: { group: string; command: string }[] = [];

    migrate = async () => {


        await this.db.migrate();
    };
    factory: AppFactory;
    socketServer: SocketServer;
    requestTypes!: string;
    config!: AppConfig;
    localCtx: Map<string, any> = new Map();

    _server: Deno.HttpServer | undefined;
    middleware: ((
        req: IRLRequest,
        res: IRLResponse,
        app: IRLApp<Id, G>["bindObject"],
    ) => Promise<void>)[] = [];
    private _bootActions: Array<
        (app: IRLApp<Id, G>["bindObject"]) => Promise<void> | void
    > = [];
    actions: Record<string, Record<string, any>>;
    cli = new IrlCli();
    server: {
        host: string;
        port: number;
        secure?: boolean;
    };
    bindObject!: GlobalTypes & G;

    /**
     * Create a new IRLApp instance
     * @param name
     * @param options
     */
    constructor(
        name: Id,
        options?: {
            dbAdapter?: IRLDBAdapter | "json";
            port?: number;
            host?: string;
            middleware?: ((req: IRLRequest, app: IRLApp<Id, G>) => Promise<void>)[];
            globals?: G;
            bootAction?: (app: IRLApp<Id, G>["bindObject"]) => Promise<void> | void;
            appRoot?: string;
        },
    ) {
        this.actions = {};
        this.appRootPath = options?.appRoot || Deno.cwd();
        this.publicFileRoot = joinPath(this.appRootPath, "public");
        this.cache = new MemcachePool({size: 10});
        this.db = new IRLDB(this.cache);
        this.factory = new AppFactory(options?.appRoot || Deno.cwd(), this.cache);
        this.socketServer = new SocketServer();
        this.globals = options?.globals || {} as G;
        this.server = {
            host: options?.host || "localhost",
            port: options?.port || 8000,
        };
        this.appName = formatter.convertToTitleCase(name);
        if (options?.bootAction) {
            this._bootActions.push(options.bootAction);
        }
    }

    private async getModel(id: string) {
        return await this.cache.getJson<IRLModel>('model', id);
    }

    private addStandardActions() {
        this.addAction("app", "status", {
            description: "Get the app status",
            action: (app) => {
                return {
                    version: "1.0",
                    appName: app.appName,
                };
            },
            response: "any",

        })
        this.addAction("app", "generate", {
            description: "Generate a new app",
            action: async (app, {host, port, appName}) => {
                host = "";
                await this.factory.load();
                return await this.factory.generate({
                    appName: appName,
                    server: {
                        host,
                        port,
                    },
                });
            },
            params: {
                appName: {
                    type: "Data",
                    required: true,
                },
                host: {
                    required: false,
                    type: "Data",
                },
                port: {
                    type: "Number",
                    required: false,
                },
            },
        });
        this.addAction("app", "updateConfig", {
            description: "Update the app config",
            action: async (app, {key, value}) => {
                const configKey = key as keyof AppConfig;
                if (key && key === "server") {
                    try {
                        value = JSON.parse(value);
                    } catch (_e) {
                        return {error: "Invalid JSON"};
                    }
                }
                return await this.factory.updateConfig(configKey, value);
            },
            response: "AppConfig",
            params: {
                key: {
                    type: "Data",
                    required: true,
                },
                value: {
                    type: "Data",
                    required: true,
                },
            },
        });
        this.addAction("app", "apiDocs", {
            description: "Get the API for the app",
            action: (app) => {
                return app.docs;
            },
            response: "APIGroup[]",
        });
        this.addAction("app", "apiTypes", {
            description: "Get the types for the app",
            action: (app) => {
                return app.requestTypes;
            },
            response: "string",
        });
        this.addAction("app", "shutdown", {
            description: "Shutdown the app",
            action: async (app) => {
                await this._server?.shutdown();
            },
        });

        this.addAction("socket", "listRooms", {
            description: "List all rooms",
            action: (app) => {
                return app.socketServer.rooms;
            },
        });
        this.addAction("record", "createRecord", {
            description: "Create a new record",
            action: async (app, {modelId, data}) => {
                const record = await app.db.createRecord(modelId, data);
                this.socketServer.sendToRoomEvent("record", "create", record);
                return record;
            },
            params: {
                modelId: {
                    required: true,
                    type: "Data",
                },
                data: {
                    required: true,
                    type: "Json",
                },
            },
            response: "IRLRecord",
        });
        this.addAction("record", "listRecords", {
            description: "List records",
            action: async (app, {modelId, columns, filters}) => {
                return await app.db.listRecords(modelId, {
                    columns,
                    filters,
                });
            },
            // MARK: Thing
            params: {
                modelId: {
                    required: true,
                    type: "Data",
                },
                filters: {
                    required: false,
                    type: "Json",
                },
                columns: {
                    required: false,
                    type: "List",
                },
            },
            response: "IRLRecord[]",
        });
        // region Record Actions
        this.addAction("record", "getRecord", {
            description: "Get a record",
            action: async (app, {modelId, recordId}) => {
                return await app.db.getRecord(modelId, recordId);
            },
            params: {
                modelId: {
                    required: true,
                    type: "Data",
                },
                recordId: {
                    required: true,
                    type: "Data",
                },
            },
            response: "IRLRecord",
        });
        this.addAction("record", "update", {
            description: "Update a record",
            action: async (app, {modelId, recordId, data}) => {
                const record = await app.db.updateRecord(modelId, recordId, data);
                this.socketServer.sendToRoomEvent("record", "update", record);
                return record;
            },
            params: {
                modelId: {
                    required: true,
                    type: "Data",
                },
                recordId: {
                    required: true,
                    type: "Data",
                },
                data: {
                    required: true,
                    type: "Json",
                },
            },
        });
        this.addAction("record", "delete", {
            description: "Delete a record",
            action: async (app, {modelId, recordId}) => {
                const result = await app.db.deleteRecord(modelId, recordId);
                this.socketServer.sendToRoomEvent("record", "delete", result);
                return result;
            },
            params: {
                modelId: {
                    required: true,
                    type: "Data",
                },
                recordId: {
                    required: true,
                    type: "Data",
                },
            },
        });
        this.addAction("record", "meta", {
            description: "Get meta data for a record",
            action: (app, {modelId}) => {
                return app.db.models.find((m) => m.id === modelId);
            },
            params: {
                modelId: {
                    required: true,
                    type: "Data",
                },
            },
        });
        this.addAction("record", "action", {
            description: "Run an action on a record",
            action: async (app, {modelId, recordId, actionId, params}) => {
                irLog(
                    `Running action ${actionId} on record ${recordId} in model ${modelId}`,
                );
                const model = await this.getModel(modelId);
                if (!model) {
                    raiseIRLException("Model not found", "DoesNotExist")
                    return
                }
                const action = model.actions.find((a) => a.id === actionId);

                const record = await app.db.getRecord(modelId, recordId);
                if (action?.function) {
                    return action?.function(record, app, params);
                }
            },
            params: {
                modelId: {
                    required: true,
                    type: "Data",
                },
                recordId: {
                    required: false,
                    type: "Data",
                },
                actionId: {
                    required: true,
                    type: "Data",
                },
                params: {
                    required: false,
                    type: "Json",
                },
            },
            response: "any",
        });
        this.addAction("db", "migrate", {
            description: "Migrate the database",
            action: async (app) => {


                await this.db.migrate();
                return {
                    message: "Migration complete",
                };
            },
        });
        this.addAction("db", "listModels", {
            description: "List all models",
            action: (app) => {
                return app.db.models;
            },
            response: "IRLModel[]",
        });
    }

    private addStandardSocketRooms() {
        this.addSocketRooms([{
            name: "record",
            events: ["create", "update", "delete"],
        }]);
    }

    private addFactorySocketRooms() {
        this.addSocketRooms([{
            name: "model",
            events: ["update", "delete", "create", "reload", "list"],
        }]);
    }

    private addFactoryActions() {
        this.addAction("model", "get", {
            description: "Get a model",
            action: async (app, {id}) => {
                irLog(`Getting model ${id}`);
                return await this.cache.getJson('model', id);
                // return this.factory.getModel(id);
            },
            params: {
                id: {
                    type: "Data",
                    required: true,
                },
            },
            response: "IRLModel",
        });
        this.addAction("model", "create", {
            description: "Create a new model",
            action: async (app, {modelName}) => {
                const model = await this.factory.addModel(modelName);
                await this.migrate();
                app.socketServer.sendToRoomEvent("model", "update", model);
                return model;
            },
            params: {
                modelName: {
                    type: "Data",
                    required: true,
                },
            },
            response: "IRLModel",
        });
        this.addAction("model", "list", {
            description: "List all models",
            action: async (app) => {
                return await this.cache.getList('models');
                // return this.models;
            },
            response: "IRLModel[]",
        });
        this.addAction("model", "update", {
            description: "Update a model",
            action: async (app, {id, data}) => {
                const updateData = data as Partial<IRLModel>;
                const model = await this.factory.updateModel(id, updateData);
                await this.migrate();


                app.socketServer.sendToRoomEvent("model", "update", model);
            },
            params: {
                id: {
                    type: "Data",
                    required: true,
                },
                data: {
                    type: "Json",
                    required: true,
                },
            },
        });
        this.addAction("model", "delete", {
            description: "Delete a model",
            action: async (app, {id}) => {
                await this.factory.deleteModel(id);
                await this.migrate();
            },
            params: {
                id: {
                    type: "Data",
                    required: true,
                },
            },
        });
        this.addAction("model", "reload", {
            description: "Reload the models",
            action: async (app) => {
                await this.installBundles();

            },
            response: "IRLModel[]",
        });
    }

    async installBundle(bundlePath: string) {
        const models: IRLModel[] = [];
        const bundleName = bundlePath.split("/").pop();
        // const bundleTSPath = joinPath(bundlePath, "bundle.ts");
        // let hasBundle = false;
        // try {
        //     await Deno.stat(bundleTSPath)
        //     hasBundle = true
        // } catch (_e) {
        //
        // }
        // if (hasBundle) {
        //     irLog(`Loading bundle ${bundleTSPath}`)
        //     const bundle = await import(bundleTSPath);
        //     bundle.default(this);
        // }
        const modelsDirs = Deno.readDir(bundlePath);
        for await (const model of modelsDirs) {
            if (!model.isDirectory) continue;
            const modelPath = joinPath(bundlePath, model.name, `${model.name}.json`);
            try {
                const modelData = await Deno.readTextFile(modelPath);
                const model = JSON.parse(modelData) as IRLModel;
                model.actions = model.actions.map((a) => {
                    a.function = new Function("record", "app", "params", a.code) as any;
                    return a;
                });
                await this.cache.setJson('model', model.id, model);

                models.push(model);
            } catch (e) {
                irLog(
                    `Error loading model ${model.name}: ${e.message}`,
                    "Error",
                );
            }
        }
        return models;

    }

    private async installBundles() {
        const models: IRLModel[] = [];
        const appSrcPath = Deno.realPathSync(joinPath(this.appRootPath, "..", "src"))
        // const builtInBundlePath = joinPath(appSrcPath, "bundles");

        const bundlesPath = joinPath(this.appRootPath, "bundles");


        try {
            await Deno.stat(bundlesPath);
        } catch (e) {
            await Deno.mkdir(bundlesPath);
        }
        const bundleDirs = Deno.readDir(bundlesPath);
        for await (const bundleDir of bundleDirs) {
            const bundleModels = await this.installBundle(joinPath(bundlesPath, bundleDir.name));
            models.push(...bundleModels);
        }
        await this.cache.setList('models', models)
        return models;
    }

    async masterBoot() {
        await this.installBundles();
    }

    private async boot() {
        this.addStandardActions();
        this.addFactoryActions();
        this.addStandardSocketRooms();
        this.addFactorySocketRooms();
        // await this.installBundles();
        this.factory.loadBundles = this.installBundles.bind(this);
        this.config = await AppConfigLoader.loadAppConfig(this.appRootPath);
        // await this.factory.load();
        this.server = this.config.server || {
            host: "localhost",
            port: 8080,
        };
        // this.models = this.factory.models

        this.requestTypes = this.buildRequestTypes();
        await this.db.boot();
        this.bindObject = {
            appName: this.appName,
            socketServer: this.socketServer,
            ...this.globals,
            server: this.server,
            docs: this.actionDocs,
            db: this.db,
            requestTypes: this.requestTypes,
            publicActions: this.publicActions,
        } as G & GlobalTypes;
        this.buildCli();
    }

    private buildCli() {
        this.cli.addMenuItem({
            title: "Start Server",
            description:
                `Start the http server on ${this.server.host}:${this.server.port}`,
            action: () => {
                console.clear();
                this.serve();
            },
            returnWhenDone: true,
        });
        const bindObject = this.bindObject;
        for (const group in this.actions) {
            this.cli.addMenuItem({
                title: formatter.camelToTitleCase(group),
                description: `Run ${group} commands`,
                subMenu: new CliMenu(group, {
                    onBack: {
                        title: "Back",
                        description: "Go back to the main menu",
                        action: () => {
                        },
                    },
                    menuItems: Object.keys(this.actions[group]).map((command) => {
                        const comm = this.actions[group][command] as any;
                        return {
                            title: formatter.camelToTitleCase(command),
                            description: comm.description,
                            async action() {
                                const prompter = new CliPrompter({
                                    data: comm.params,
                                    onGotData: async (data) => {
                                        try {
                                            const result = await comm.action(bindObject, data);
                                            console.log(result);
                                            prompt(
                                                colorMe.brightGreen("Press any key to continue..."),
                                            );
                                        } catch (e) {
                                            console.log(e);
                                            await asyncPause(2000);
                                        }
                                    },
                                });
                                const result = await prompter.prompt();
                                console.log(result);
                                // prompt("Press Enter to continue")
                                return result;
                            },
                        };
                    }),
                }),
            });
        }
    }

    addAction<
        P extends {
            [K in keyof P]: {
                required: boolean;
                type: keyof FieldTypeMap;
            };
        },
    >(group: string, command: string, options: {
        description: string;
        public?: boolean;
        action: (
            app: IRLApp<Id, G>["bindObject"],
            data: {
                [E in keyof P]: FieldTypeMap[P[E]["type"]];
            },
        ) => Promise<any> | any;
        params?: P;
        response?: string;
    }) {
        const action = this.buildAction(options);
        if (!this.actions[group]) {
            this.actions = {
                ...this.actions,
                [group]: {},
            };
        }
        this.actions[group] = {
            ...this.actions[group],
            [command]: action,
        };
        if (options.public) {
            this.publicActions.push({group, command});
        }
    }

    addSocketRooms(rooms: SocketRoomDef[]) {
        this.socketServer.addRooms(rooms);
    }

    addMiddleware(
        middleware: (
            req: IRLRequest,
            res: IRLResponse,
            app: IRLApp<Id, G>["bindObject"],
        ) => Promise<void>,
    ) {
        this.middleware.push(middleware);
    }

    private buildAction(action: any) {
        const paramsObj = {} as Record<string, any>;
        const requiredParams: string[] = [];
        for (const paramKey in action.params) {
            if (action.params[paramKey].required) {
                requiredParams.push(paramKey);
            }
            paramsObj[paramKey] = null;
        }
        const newAction = async (
            app: IRLApp<Id, G>["bindObject"],
            data?: Record<string, any>,
        ) => {
            if (!data && requiredParams.length > 0) {
                raiseIRLException(
                    `Missing required parameters: ${Object.keys(paramsObj).join(", ")}`,
                    "MissingParameter",
                );
            }
            if (data) {
                const missingParams = [];
                for (const key in paramsObj) {
                    if (requiredParams.includes(key) && !data[key]) {
                        missingParams.push(key);
                        continue;
                    }
                    paramsObj[key] = data[key];
                }
                if (missingParams.length > 0) {
                    raiseIRLException(
                        `Missing required parameters: ${missingParams.join(", ")}`,
                        "MissingParameter",
                    );
                }
            }
            return await action.action(app, paramsObj);
        };
        return {
            description: action.description,
            action: newAction,
            params: action.params,
            response: action.response,
        };
    }

    getCommandsDocs(groupName: string) {
        const group = this.actions[groupName];
        const docs = {
            name: groupName,
            commands: {},
        };
        for (const key in group) {
            const command = group[key] as any;
            docs.commands = {
                ...docs.commands,
                [key]: {
                    description: command.description,
                    params: command.params,
                    response: command.response,
                },
            };
        }
        return docs;
    }

    get actionDocs() {
        const fullDocs: any[] = [];
        for (const groupKey in this.actions) {
            const groupDocs = this.getCommandsDocs(groupKey);
            fullDocs.push(groupDocs);
        }
        return fullDocs as any;
    }

    buildRequestTypes() {
        const data = this.actionDocs;
        let typeString = `type  RequestMap = RequestStructure<{`;
        for (const group of data) {
            typeString += `\n  ${group.name}: {`;
            for (const command in group.commands) {
                const commandData = group.commands[command];
                typeString += `\n    ${command}: {`;
                typeString += `\n      params: {`;
                for (const param in commandData.params) {
                    const paramData = commandData.params[param];
                    typeString += `\n        ${param}${
                        paramData.required ? "" : "?"
                    }: FieldTypes["${paramData.type}"]`;
                }
                typeString += `\n      },`;
                typeString += `\n      response: ${commandData.response || "void"}`;
                typeString += `\n    },`;
            }
            typeString += `\n  },`;
        }
        typeString += `}>\n\n `;
        return typeString;
    }

    private async resolver(request: IRLRequest) {
        if (!request.group) {
            return this.actionDocs;
        }
        irLog(request.method)
        const requestGroup = request.group;
        const requestCommand = request.command;
        if (!requestCommand) {
            return this.getCommandsDocs(requestGroup);
        }
        const command = this.actions[requestGroup][requestCommand];
        if (!command) {
            raiseIRLException(
                `Invalid command: ${request.group}.${request.command}`,
                "MissingValue",
            );
        }
        await request.loadBody();
        this.bindObject.localCtx = this.localCtx;
        const content = await command.action(this.bindObject, request.body);
        return content || {};
    }

    async start(options?: {
        serve?: boolean;
        port?: number;
    }) {
        const args = Deno.args;
        let socketPath;
        let port = options?.port || this.server.port;
        let serve = options?.serve || false;
        if (args.includes("--serve")) {
            serve = true;
        }
        if (args.includes("--port")) {
            port = Number(args[args.indexOf("--port") + 1]);
        }
        if (args.includes("--socket")) {
            socketPath = args[args.indexOf("--socket") + 1];
        }
        await this.boot();
        try {
            await this.runBootActions();
        } catch (e) {
            if (e instanceof IRLException) {
                irLog(e.formattedMessage);
                return;
            }
            const ire = new IRLException(e.message, "Boot Error", e.name, e);
            irLog(ire.formattedMessage);
            return;
        }
        this.cli.mainMenu.menuItems[0].description =
            `Start the http server on ${this.server.host}:${this.server.port}`;

        if (serve) {
            return this.serve({
                port,
                socketPath,
            });
        }
        await this.cli.run();
    }

    serve(options?: {
        port?: number;
        socketPath?: string;
    }) {
        // await asyncPause(500)
        const abort = new AbortController();
        abort.signal.addEventListener("abort", (_e) => {
            console.log("Server stopped");
        });
        const host = this.server.host;
        const port = options?.port || this.server.port;

        const serverOptions: Record<string, any> = {};
        if (options?.socketPath) {
            serverOptions["transport"] = "unix";
            serverOptions["path"] = options.socketPath;
        } else {
            serverOptions["hostname"] = host;
            serverOptions["port"] = port;
        }

        this._server = Deno.serve(serverOptions, async (req) => {

            this.localCtx.clear();
            const request = new IRLRequest(req);
            if (request.method === "OPTIONS") {
                return new IRLResponse().respond();
            }
            if (request.upgradeSocket) {
                return this.socketServer.handleUpgrade(request.req);
            }
            this.localCtx.set("response", new IRLResponse());
            const response = this.localCtx.get("response") as IRLResponse;
            this.bindObject.localCtx = this.localCtx;
            try {
                if (request.path == "/api") {
                    for (const middleware of this.middleware) {
                        await middleware(request, response, this.bindObject);
                    }

                    response.content = await this.resolver(request);
                } else {
                    return await handleFileRequest(request, this.publicFileRoot);
                }
            } catch (e: IRLException | Error | any) {
                if (e instanceof IRLException) {
                    return response.error(
                        e.message,
                        e.httpCode,
                        e.name,
                    );
                }
                console.log(e);
                irLog(e.message, "Error", e.name);
                return response.error(
                    e.message,
                    500,
                    e.cause,
                );
            }
            return response.respond();
        });
    }

    private async runBootActions() {
        for (const action of this._bootActions) {
            await action(this.bindObject);
        }
    }
}
