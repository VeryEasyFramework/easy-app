import { createAction } from "#/actions/createAction.ts";

export const updateSettingsRecordAction = createAction("updateSettings", {
  description: "Update settings record",

  async action(app, { settingsId, data }, request) {
    const result = await app.orm.updateSettings(settingsId, data, request.user);
    return result.data;
  },
  params: {
    settingsId: {
      required: true,
      type: "DataField",
    },
    data: {
      required: true,
      type: "JSONField",
    },
  },
});

export const updateSettingsValueAction = createAction("updateSettingsValue", {
  description: "Update settings value",

  async action(app, { settingsId, key, value }, request) {
    const settingsRecord = await app.orm.getSettings(settingsId, request.user);
    settingsRecord.update({ [key]: value });
    await settingsRecord.save();
    return settingsRecord.data;
  },
  params: {
    settingsId: {
      required: true,
      type: "DataField",
    },
    key: {
      required: true,
      type: "DataField",
    },
    value: {
      required: true,
      type: "DataField",
    },
  },
});
