import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";
import { easyLog } from "#/log/logging.ts";
import { OrmException } from "#orm/ormException.ts";

export const runEntryActionAction = createAction("runEntryAction", {
  description: "Run an action that is defined on the entry",
  async action(app, { entryType, id, action, data, enqueue }, request) {
    const entry = await app.orm.getEntry(entryType, id, request.user);
    if (!entry) {
      raiseEasyException(`${entryType} doesn't exist`, 404);
    }

    try {
      if (enqueue) {
        return await entry.enqueueAction(action, data);
      }
      return await entry.runAction(action, data);
    } catch (e: unknown) {
      let message = `Error running action ${action} on entry ${entryType}: `;
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
      if (e instanceof Error) {
        easyLog.error(message + e.message, e.name ? e.name : "Error");
      }

      raiseEasyException(message, 400);
    }
  },
  params: {
    entryType: {
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
