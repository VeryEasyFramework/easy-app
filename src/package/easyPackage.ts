import type {
  MiddlewareWithoutResponse,
  MiddlewareWithResponse,
} from "#/middleware/middleware.ts";
import { createAction } from "#/actions/createAction.ts";
import type { EntityDefinition } from "@vef/easy-orm";
import type { SocketRoomDef } from "#/realtime/realtimeServer.ts";
import { raiseEasyException } from "#/easyException.ts";
import type {
  ActionParams,
  CreateActionOptions,
  CreateActionParams,
  EasyAction,
} from "#/actions/actionTypes.ts";

export interface PackageInfo {
  packageName: string;
  description: string;
  version: string;
  entities: Array<string>;
  actions: Array<Record<string, string[]>>;
  middleware: Array<string>;
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

export class EasyPackage {
  middleware: Array<MiddlewareWithResponse | MiddlewareWithoutResponse> = [];
  actionGroups: Record<string, Array<EasyAction>> = {};
  entities: Array<EntityDefinition> = [];
  description: string;
  packageName: string;
  realtimeRooms: SocketRoomDef[] = [];

  version: string = "0.0.1";
  constructor(packageName: string, options?: {
    description?: string;
    version?: string;
  }) {
    this.packageName = packageName;
    this.description = options?.description || `Package ${packageName}`;
    if (options?.version) {
      this.setVersion(options.version);
    }
  }

  get packageInfo(): PackageInfo {
    return {
      packageName: this.packageName,
      description: this.description,
      version: this.version,
      entities: this.entities.map((entity) => entity.entityId),
      actions: Object.entries(this.actionGroups).map((
        [groupName, actions],
      ) => ({
        [groupName]: actions.map((action) => action.actionName),
      })),
      middleware: this.middleware.map((middleware) => middleware.name),
    };
  }
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
  addActionToGroup(group: string, action: EasyAction) {
    if (!this.actionGroups[group]) {
      this.actionGroups[group] = [];
    }

    this.actionGroups[group].push(action);
  }
  addActionGroup(group: string, actions: Array<EasyAction>) {
    for (const action of actions) {
      this.addActionToGroup(group, action);
    }
  }
  addMiddleware(middleware: MiddlewareWithoutResponse): void;
  addMiddleware(middleware: MiddlewareWithResponse): void;

  // Implementation of addMiddleware
  addMiddleware(
    middleware: MiddlewareWithResponse | MiddlewareWithoutResponse,
  ): void {
    this.middleware.push(middleware);
  }

  addRealtimeRoom(room: SocketRoomDef) {
    this.realtimeRooms.push(room);
  }
  addEntity(entity: EntityDefinition) {
    this.entities.push(entity);
  }
}
