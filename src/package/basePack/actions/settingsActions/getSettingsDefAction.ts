import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";

export const getSettingsDefAction = createAction("getSettingsType", {
  description: "Get settings type definition",

  action(app, { settingsType }, request) {
    const settings = app.orm.getSettingsType(settingsType);
    if (!settings) {
      raiseEasyException(`Settings not found: ${settingsType}`, 404);
    }
    return settings;
  },
  params: {
    settingsType: {
      required: true,
      type: "DataField",
    },
  },
});
