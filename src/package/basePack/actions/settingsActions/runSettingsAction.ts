import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";
import { easyLog } from "#/log/logging.ts";
import { OrmException } from "#orm/ormException.ts";

export const runSettingsAction = createAction("runSettingsAction", {
  description: "Run an action that is defined on the settings type",
  async action(app, { settings, action, data }, request) {
    const settingsRecord = await app.orm.getSettings(settings, request.user);
    if (!settingsRecord) {
      raiseEasyException(`${settings} doesn't exist`, 404);
    }

    try {
      return await settingsRecord.runAction(action, data);
    } catch (e: unknown) {
      let message = `Error running action ${action} on settings ${settings}: `;
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
    settings: {
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
