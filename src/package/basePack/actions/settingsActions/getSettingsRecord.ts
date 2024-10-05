import { createAction } from "#/actions/createAction.ts";

export const getSettingsRecordAction = createAction("getSettingsRecord", {
  description: "Get a Settings Entity Record",
  async action(app, data, request) {
    const { settingsId } = data;
    const settingsRecord = await app.orm.getSettings(settingsId, request.user);
    return settingsRecord.data;
  },
  params: {
    settingsId: {
      type: "DataField",
      required: true,
    },
  },
});
