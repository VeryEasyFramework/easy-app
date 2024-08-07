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
      return result;
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
      return await app.orm.createEntity(entity, data);
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
      return await app.orm.updateEntity(entity, id, data);
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
      return await app.orm.deleteEntity(entity, id);
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
