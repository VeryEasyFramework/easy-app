import { createAction } from "#/actions/createAction.ts";

export const entityActions = [
  createAction("getList", {
    description: "Get a list of items",
    action: async (app, { entity }) => {
      return await app.orm.getEntityList(entity);
    },
    params: {
      entity: {
        required: true,
        type: "string",
      },
    },
    response: "any[]",
  }),
  createAction("getEntity", {
    description: "Get a single entity",
    action: async (app, { entity, id }) => {
      return await app.orm.getEntity(entity, id);
    },
    params: {
      entity: {
        required: true,
        type: "string",
      },
      id: {
        required: true,
        type: "string",
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
        type: "string",
      },
      data: {
        required: true,
        type: "object",
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
        type: "string",
      },
      id: {
        required: true,
        type: "string",
      },
      data: {
        required: true,
        type: "object",
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
        type: "string",
      },
      id: {
        required: true,
        type: "string",
      },
    },
    response: "void",
  }),
];
