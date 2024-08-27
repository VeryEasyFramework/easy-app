import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";
import type { ListOptions } from "@vef/easy-orm";
import { easyLog } from "#/log/logging.ts";

export const entityActions = [
  createAction("getList", {
    description: "Get a list of entities",
    action: async (app, data) => {
      const options = {} as ListOptions;
      if (data.filter) {
        options.filter = data.filter;
      }
      if (data.limit) {
        options.limit = data.limit;
      }
      if (data.offset) {
        options.offset = data.offset;
      }
      if (data.orderBy) {
        options.orderBy = data.orderBy;
      }
      if (data.order) {
        if (data.order !== "asc" && data.order !== "desc") {
          raiseEasyException(
            "Invalid order value. Must be 'asc' or 'desc'",
            400,
          );
        }
        options.order = data.order as "asc" | "desc";
      }
      if (data.columns) {
        options.columns = data.columns as unknown as string[];
      }
      return await app.orm.getEntityList(data.entity, options);
    },
    params: {
      entity: {
        required: true,
        type: "DataField",
      },
      filter: {
        required: false,
        type: "JSONField",
      },
      limit: {
        required: false,
        type: "IntField",
      },
      offset: {
        required: false,
        type: "IntField",
      },
      orderBy: {
        required: false,
        type: "DataField",
      },
      order: {
        required: false,
        type: "DataField",
      },
      columns: {
        required: false,
        type: "DataField",
      },
    },
    response: "any[]",
  }),
  createAction("getEntity", {
    description: "Get a single entity",
    action: async (app, { entity, id }) => {
      const result = await app.orm.getEntity(entity, id);
      if (!result) {
        raiseEasyException("Entity not found", 404);
      }
      if ("orm" in result) {
        delete result.orm;
      }
      return result.data;
    },
    params: {
      entity: {
        required: true,
        type: "DataField",
      },
      id: {
        required: true,
        type: "DataField",
      },
    },
    response: "any",
  }),
  createAction("createEntity", {
    description: "Create a new entity",
    action: async (app, { entity, data }) => {
      const newEntity = await app.orm.createEntity(entity, data);
      const room = `entity:${entity}`;
      const notifyData = {
        entity,
        data: newEntity.data,
      };
      app.notify(room, "create", notifyData);
      app.notify(room, "list", notifyData);
      return newEntity.data;
    },
    params: {
      entity: {
        required: true,
        type: "DataField",
      },
      data: {
        required: true,
        type: "JSONField",
      },
    },
    response: "any",
  }),
  createAction("updateEntity", {
    description: "Update an entity",
    action: async (app, { entity, id, data }) => {
      const updatedEntity = await app.orm.updateEntity(entity, id, data);
      const room = `entity:${entity}`;
      const notifyData = {
        entity,
        data: updatedEntity.data,
      };
      app.notify(room, "update", notifyData);
      app.notify(room, "list", notifyData);
      return updatedEntity.data;
    },
    params: {
      entity: {
        required: true,
        type: "DataField",
      },
      id: {
        required: true,
        type: "DataField",
      },
      data: {
        required: true,
        type: "JSONField",
      },
    },
    response: "any",
  }),
  createAction("deleteEntity", {
    description: "Delete an entity",
    action: async (app, { entity, id }) => {
      const deleted = await app.orm.deleteEntity(entity, id);
      const room = `entity:${entity}`;
      const notifyData = {
        entity,
        id,
      };
      app.notify(room, "delete", notifyData);
      app.notify(room, "list", notifyData);
      return deleted;
    },
    params: {
      entity: {
        required: true,
        type: "DataField",
      },
      id: {
        required: true,
        type: "DataField",
      },
    },
    response: "void",
  }),
  createAction("getEntityInfo", {
    description: "Get the entity info",
    action: async (app, { entity }) => {
      const entityDef = app.orm.entityInfo.find((e) => e.entityId === entity);
      if (!entityDef) {
        raiseEasyException("Entity not found", 404);
      }
      return entityDef;
    },
    params: {
      entity: {
        required: true,
        type: "DataField",
      },
    },
    response: "EntityInfo",
  }),

  createAction("runAction", {
    description: "Run an action that is defined on the entity",
    async action(app, { entity, id, actionName, data }) {
      const entityRecord = await app.orm.getEntity(entity, id);
      if (!entityRecord) {
        raiseEasyException(`${entity} doesn't exist`, 404);
      }
      if (actionName! in entityRecord) {
        raiseEasyException(
          `${actionName} is not a valid action on ${entity} entities`,
          400,
        );
      }
      const action = entityRecord[actionName!];
      if (typeof action !== "function") {
        raiseEasyException(
          `${actionName} is not a valid action on ${entity} entities`,
          400,
        );
      }
      try {
        return await action(data);
      } catch (e) {
        const message =
          `Error running action ${actionName} on entity ${entity}`;
        easyLog.error(message + e.message, e.name ? e.name : "Error");

        raiseEasyException(message, 400);
      }
    },
    params: {
      entity: {
        required: true,
        type: "DataField",
      },
      id: {
        required: true,
        type: "DataField",
      },
      actionName: {
        required: true,
        type: "DataField",
      },
      data: {
        required: false,
        type: "JSONField",
      },
      enqueue: {
        required: false,
        type: "BooleanField",
      },
    },
  }),
];
