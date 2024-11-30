import { createAction } from "#/actions/createAction.ts";

export const updateSettingsRecordAction = createAction("updateSettings", {
  description: "Update settings record",

  async action(app, { settingsType, data }, request) {
    const result = await app.orm.updateSettings(
      settingsType,
      data,
      request.user,
    );
    return result.data;
  },
  params: {
    settingsType: {
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

  async action(app, { settingsType, key, value }, request) {
    const settingsRecord = await app.orm.getSettings(
      settingsType,
      request.user,
    );
    settingsRecord.update({ [key]: value });
    await settingsRecord.save();
    return settingsRecord.data;
  },
  params: {
    settingsType: {
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
