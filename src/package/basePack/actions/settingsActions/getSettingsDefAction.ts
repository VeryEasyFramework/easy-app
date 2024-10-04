import { createAction } from "#/actions/createAction.ts";
import { raiseEasyException } from "#/easyException.ts";

export const getSettingsDefAction = createAction("getSettingsDef", {
  description: "Get settings definition",

  action(app, { settingsId }, request) {
    const settings = app.orm.getSettingsEntity(settingsId);
    if (!settings) {
      raiseEasyException(`Settings not found: ${settingsId}`, 404);
    }
    return settings;
  },
  params: {
    settingsId: {
      required: true,
      type: "DataField",
    },
  },
});
