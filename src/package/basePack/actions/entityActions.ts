import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";

export const entityActions = [
  createAction("getList", {
    description: "Get a list of items",
    action: async (app, { entity }) => {
      return await app.orm.getEntityList(entity);
    },
    params: {
      entity: {
        required: true,
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

      app.notify("entity", "create", {
        entity,
        data: newEntity,
      });
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
      app.notify("entity", "update", {
        entity,
        data: updatedEntity.data,
      });
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
      app.notify("entity", "delete", {
        entity,
        id,
      });
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
];
