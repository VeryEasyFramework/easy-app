import { createAction } from "#/actions/createAction.ts";

export const getSettingsAction = createAction("getSettings", {
  description: "Get the settings for a settings type",
  async action(app, data, request) {
    const { settingsType } = data;
    const settings = await app.orm.getSettings(
      settingsType,
      request.user,
    );
    return settings.data;
  },
  params: {
    settingsType: {
      type: "DataField",
      required: true,
    },
  },
});
