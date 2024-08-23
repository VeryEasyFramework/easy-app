import type {
  MiddlewareWithoutResponse,
  MiddlewareWithResponse,
} from "#/middleware/middleware.ts";
import { createAction } from "#/actions/createAction.ts";
import {
  defineEntity,
  type EasyField,
  type EasyFieldType,
  type EntityActionRecord,
  type EntityConfig,
  type EntityDefinition,
  type EntityHooks,
  type ExtractEntityFields,
  type Orm,
} from "@vef/easy-orm";
import type { SocketRoomDef } from "#/realtime/realtimeTypes.ts";
import { raiseEasyException } from "#/easyException.ts";
import type {
  ActionParams,
  CreateActionOptions,
  CreateActionParams,
  EasyAction,
} from "#/actions/actionTypes.ts";
import type { BootAction } from "#/types.ts";

export interface EasyPackInfo {
  EasyPackName: string;
  description: string;
  version: string;
  entities: Array<string>;
  actions: Array<Record<string, string[]>>;
  middleware: Array<string>;
  bootActions: Array<{ actionName: string; description: string }>;
}

// enforce no decimal numbers
type Integer = number & { __integer__: void };

// Type guard function to check if a number is an integer
function isInteger(value: number): value is Integer {
  return Number.isInteger(value);
}

function validateSemverString(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * An `EasyPack` is tidy way to create a feature or group of features in your EasyApp.
 * EasyPacks can contain:
 *
 * - **Actions** - Actions are the main way to interact with your app,
 * - **Middleware** - Middleware is used to perform tasks such as authentication, logging, or modifying the request or response,
 * - **Entities** - Entities are used to define the structure of the data that is stored in the database,
 * - **Realtime Rooms** - Realtime rooms are used to group together clients that are connected to the realtime server.
 * - **Version** - The version of the EasyPack
 * - **Description** - A description of the EasyPack
 * - **Pack Info** - Information about the EasyPack
 *
 * **Usage**
 *
 * *Creating an EasyPack*
 * ```ts
 * const myEasyPack = new EasyPack("myEasyPack", {
 *  description: "This is my EasyPack",
 * version: "1.0.0"
 * });
 * // Now add it to your app
 * app.addPack(myEasyPack);
 * ```
 *
 * **Available methods**
 *
 * - ***`addAction`*** - Add an action to the EasyPack
 * - ***`addActionGroup`*** - Add multiple actions to a group
 * - ***`addActionToGroup`*** - Add an action to a group
 * - ***`addEntity`*** - Add an entity to the EasyPack
 * - ***`addMiddleware`*** - Add middleware to the EasyPack
 * - ***`addRealtimeRoom`*** - Add a realtime room to the EasyPack
 * - ***`setVersion`*** - Set the version of the EasyPack
 * - ***`easyPackInfo`*** - Get the EasyPack info
 */
export class EasyPack {
  middleware: Array<MiddlewareWithResponse | MiddlewareWithoutResponse> = [];
  actionGroups: Record<string, Array<EasyAction>> = {};
  entities: Array<EntityDefinition> = [];
  bootActions: Array<BootAction> = [];
  description: string;

  /**
   * The name of the EasyPack
   */
  easyPackName: string;

  /**
   * The realtime rooms that this EasyPack uses
   */
  realtimeRooms: SocketRoomDef[] = [];

  version: string = "0.0.1";

  constructor(easyPackName: string, options?: {
    description?: string;
    version?: string;
  }) {
    this.easyPackName = easyPackName;
    this.description = options?.description || `Pack ${easyPackName}`;
    if (options?.version) {
      this.setVersion(options.version);
    }
  }

  /**
   * Get the EasyPack info
   */
  get easyPackInfo(): EasyPackInfo {
    return {
      EasyPackName: this.easyPackName,
      description: this.description,
      version: this.version,
      entities: this.entities.map((entity) => entity.entityId),
      actions: Object.entries(this.actionGroups).map((
        [groupName, actions],
      ) => ({
        [groupName]: actions.map((action) => action.actionName),
      })),
      bootActions: this.bootActions.map((action) => ({
        actionName: action.actionName,
        description: action.description || "",
      })),
      middleware: this.middleware.map((middleware) => middleware.name),
    };
  }

  /**
   * Set the version of the EasyPack. This should be in the format of `major.minor.patch`.
   * If you only provide a single argument, it will be treated as the full version string.
   * *Examples*
   * ```ts
   * // Set the version to 1.0.0
   * easyPack.setVersion("1.0.0");
   * ```
   * ```ts
   * // Set the version to 1.0.0
   * easyPack.setVersion(1, 0, 0);
   * ```
   * ```ts
   * // Set the version to 1.0.0
   * easyPack.setVersion(1);
   * ```
   * ```ts
   * // Error: Version numbers must be integers
   * easyPack.setVersion(1.0);
   * ```
   */

  setVersion(version: string): void;
  setVersion(majorVersion: number): void;
  setVersion(majorVersion: number, minorVersion: number): void;
  setVersion(
    majorVersion: number,
    minorVersion: number,
    patch: number,
  ): void;
  setVersion(
    majorVersion: string | number,
    minorVersion?: number,
    patchVersion?: number,
  ): void {
    if (typeof majorVersion === "string") {
      if (!validateSemverString(majorVersion)) {
        raiseEasyException(
          "Invalid format for version. Should be in the format of major.minor.patch",
          500,
        );
      }

      this.version = majorVersion;
      return;
    }
    const major = majorVersion;
    const minor = minorVersion || 0;
    const patch = patchVersion || 0;

    if (!isInteger(major) || !isInteger(minor) || !isInteger(patch)) {
      raiseEasyException(
        "Version numbers must be integers",
        500,
      );
    }
  }
  /**
   * Add an action to the EasyPack and assign it to a group
   *
   * *Example*
   * ```ts
   * easyPack.addAction({
   *     groupName: "auth",
   *     actionName: "login",
   *     description: "Login to the app",
   *     action: (app, { username, password }) => {
   *          // your action code here
   *     },
   *    params: {
   *       username: "DataField",
   *      password: "PasswordField"
   *     },
   *  });
   * ```
   */
  addAction<
    P extends CreateActionParams<P>,
    D extends ActionParams<P>,
  >(
    options: CreateActionOptions<P, D> & {
      groupName: string;
      actionName: string;
    },
  ): void {
    const action = createAction(options.actionName, options);

    if (!this.actionGroups[options.groupName]) {
      this.actionGroups[options.groupName] = [];
    }

    this.actionGroups[options.groupName].push(action);
  }

  /**
   * Add an action to a group. This is an alternative to `addAction` that allows you to add an action to a group
   * that you may have created elsewhere. Typically this would be the case if you have many actions and want to organize
   * their declarations in other files and import them here.
   *
   * ***Example***
   *
   * ```ts
   *
   * // Create an action
   * const actionA = createAction("actionA", {
   *    description: "Action A",
   *    action: (app) => {
   *        // your action code here
   *    },
   *  });
   * // Add the action to the group
   * easyPack.addActionToGroup("groupA", actionA);
   *
   * ```
   * > **Note:** If the group does not exist, it will be created.
   */
  addActionToGroup(group: string, action: EasyAction) {
    if (!this.actionGroups[group]) {
      this.actionGroups[group] = [];
    }

    this.actionGroups[group].push(action);
  }

  /**
   * Add multiple actions to a group. This is useful if you want to add multiple actions to a group at once
   * instead of calling `addAction` multiple times.
   *
   * ***Example***
   * ```ts
   * // Create two actions
   * const actionA = createAction("actionA", {
   *    description: "Action A",
   *    action: (app) => {
   *       return "Action A";
   *    },
   *    response: "string",
   *  });
   *
   * const actionB = createAction("actionB", {
   *    description: "Action B",
   *    action: (app) => {
   *      return "Action B";
   *    },
   *    response: "string",
   *   });
   *
   * // Add both actions to the group
   * easyPack.addActionGroup("groupA", [actionA, actionB]);
   * ```
   */
  addActionGroup(group: string, actions: Array<EasyAction>) {
    for (const action of actions) {
      this.addActionToGroup(group, action);
    }
  }

  /**
   * Add a middleware to the EasyPack. This middleware will be run before the api handler for the action.
   * Middleware can be used to perform tasks such as authentication, logging, or modifying the request or response.
   *
   * There are two types of middleware:
   *  - Middleware that does not return a response
   * - Middleware that returns a response
   * Middleware that returns a response can be used to short-circuit the request and return a response without
   * calling the api handler.
   *
   * **Example**
   * ```ts
   * easyPack.addMiddleware((app:EasyApp, easyRequest:EasyRequest) void => {
   *   // your middleware code here
   * });
   *
   * easyPack.addMiddleware((app:EasyApp,
   *                        easyRequest:EasyRequest,
   *                        easyResponse:EasyResponse):EasyResponse => {
   *
   *    // your middleware code here
   *    easyResponse.setContext("myCookie", "someValue");
   *    return easyResponse;
   * });
   * ```
   */
  addMiddleware(middleware: MiddlewareWithoutResponse): void;
  addMiddleware(middleware: MiddlewareWithResponse): void;

  // Implementation of addMiddleware
  addMiddleware(
    middleware: MiddlewareWithResponse | MiddlewareWithoutResponse,
  ): void {
    this.middleware.push(middleware);
  }

  /**
   *  Add a boot action to the EasyPack. Boot actions are run once when the app starts up.
   *
   * **Example**
   * ```ts
   * easyPack.onBoot({
   * name: "myBootAction",
   * description: "My boot action",
   * action: (app:EasyApp) => {
   *   // your boot action code here
   *    }
   * });
   * ```
   */
  onBoot(bootAction: BootAction): void {
    this.bootActions.push(bootAction);
  }
  /**
   * Add a realtime room to the EasyPack. Realtime rooms are used to group together clients that are connected to the
   * realtime server. You can send messages to all clients in a room by sending a message to the room.
   *
   * **Example**
   * ```ts
   * easyPack.addRealtimeRoom({
   *  roomName: "chat",
   *  description: "A chat room",
   *  events: [ "message", "join", "leave" ]
   * });
   * ```
   */
  addRealtimeRoom(room: SocketRoomDef) {
    this.realtimeRooms.push(room);
  }

  /**
   * Define an entity directly in the EasyPack. Entities are used to define the structure of the data that is stored in the database.
   * Entities are defined using the EasyORM library.
   *
   * **Example**
   * ```ts
   *  myEasyPack.defineEntity("user",{
   *   label: "User",
   *   fields: [
   *    {
   *      key: "username",
   *      fieldType: "DataField",
   *      label: "Username",
   *     },
   *   ],
   *  });
   * ```
   */
  defineEntity<
    Id extends string,
    P extends PropertyKey,
    T extends EasyFieldType,
    F extends EasyField<P, T>[],
    H extends Partial<EntityHooks>,
    AP extends PropertyKey | undefined,
    A extends EntityActionRecord<AP>,
  >(entityId: Id, options: {
    label: string;
    fields: F;
    tableName?: string;
    config?: EntityConfig;
    hooks?:
      & H
      & ThisType<
        EntityHooks & ExtractEntityFields<F> & A & { orm: Orm }
      >;
    actions?:
      & A
      & ThisType<A & EntityHooks & ExtractEntityFields<F> & { orm: Orm }>;
  }) {
    this.entities.push(defineEntity(entityId, options));
  }

  /**
   * Add an entity to the EasyPack. This is an alternative to `defineEntity` that allows you to add an entity that you may have created elsewhere.
   * Typically this would be the case if you have many entities and want to organize their declarations in other files and import them here.
   *
   * **Example**
   * ```ts
   * // Create an entity
   * const userEntity = defineEntity("user", {
   *      label: "User",
   *      fields: [
   *        {
   *          key: "username",
   *          fieldType: "DataField",
   *          label: "Username",
   *        },
   *      ],
   *    });
   *
   * // Add the entity to the EasyPack
   * easyPack.addEntity(userEntity);
   */

  addEntity(entity: EntityDefinition) {
    this.entities.push(entity);
  }
}
