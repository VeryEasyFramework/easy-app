import {
  MiddlewareWithoutResponse,
  MiddlewareWithResponse,
} from "#/middleware/middleware.ts";
import {
  ActionParams,
  createAction,
  CreateActionOptions,
  CreateActionParams,
  EasyAction,
} from "#/actions/createAction.ts";
import { EntityDefinition } from "@vef/easy-orm";

createAction("apiDocs", {
  action: (app, { name }) => {},
  description: "Get the API for the app",
  params: {
    name: {
      required: true,
      type: "IntField",
    },
  },
});

export interface PackageInfo {
  packageName: string;
  description: string;
  version: string;
  entities: Array<string>;
  actions: Array<Record<string, string[]>>;
  middleware: Array<string>;
}

export class EasyPackage {
  middleware: Array<MiddlewareWithResponse | MiddlewareWithoutResponse> = [];
  actionGroups: Record<string, Array<EasyAction>> = {};
  entities: Array<EntityDefinition> = [];
  description: string;
  packageName: string;
  version: string = "0.0.1";
  constructor(packageName: string, options?: {
    description?: string;
    version?: string;
  }) {
    this.packageName = packageName;
    this.description = options?.description || `Package ${packageName}`;
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
        [groupName]: actions.map((action) => action.name),
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

  addEntity(entity: EntityDefinition) {
    this.entities.push(entity);
  }
}
