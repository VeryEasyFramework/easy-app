import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";
import { OrmException } from "@vef/easy-orm";
import { easyLog } from "#/log/logging.ts";

export const runEntityActionAction = createAction("runEntityAction", {
  description: "Run an action that is defined on the entity",
  async action(app, { entity, id, action, data }, request) {
    const entityRecord = await app.orm.getEntity(entity, id, request.user);
    if (!entityRecord) {
      raiseEasyException(`${entity} doesn't exist`, 404);
    }

    try {
      return await entityRecord.runAction(action, data);
    } catch (e) {
      let message = `Error running action ${action} on entity ${entity}: `;
      if (e instanceof OrmException) {
        switch (e.type) {
          case "MissingActionParam":
            message += e.message;
            raiseEasyException(message, 400);
            break;
          default:
            message += e.message;
            raiseEasyException(message, 400);
        }
      }

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
    action: {
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
});
