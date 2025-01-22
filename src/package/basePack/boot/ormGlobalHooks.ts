import type { BootAction } from "#/types.ts";

export const ormGlobalHooks: BootAction = {
  actionName: "addOrmGlobalHooks",
  description: "Create realtime rooms for each entry type",
  action(app) {
    app.orm.addGlobalHook("afterInsert", async (entryType, entry) => {
      if (entryType === "editLog") {
        return;
      }
      const { titleField } = entry._entryType.config;
      const titleValue = titleField ? entry[titleField] : entry.id;
      await app.orm.createEntry("editLog", {
        entryType,
        entryId: entry.id,
        action: "create",
        entryTitle: titleValue,
        user: entry._user?.id,
        editData: entry.data,
      });

      const room = `entryType:${entryType}`;
      const notifyData = {
        entryType: entryType,
        data: entry.data,
      };
      app.notify(room, "list", {
        action: "create",
        ...notifyData,
      });
    });

    app.orm.addGlobalHook(
      "afterChange",
      async (entryType, entry, changedData) => {
        if (entryType === "editLog") {
          return;
        }
        if (!changedData) {
          return;
        }
        if (entry._entryType.config.editLog) {
          const { titleField } = entry._entryType.config;
          const titleValue = titleField ? entry[titleField] : entry.id;
          await app.orm.createEntry("editLog", {
            entryType: entryType,
            entryId: entry.id,
            action: "update",
            entryTitle: titleValue,
            user: entry._user?.id,
            editData: changedData,
          }, entry._user);
        }
        const room = `entryType:${entryType}`;
        const notifyData = {
          entryType: entryType,
          data: entry.data,
        };
        app.notify(`${room}:${entry.id}`, "update", notifyData);
        app.notify(room, "list", {
          action: "update",
          ...notifyData,
        });
      },
    );

    app.orm.addGlobalSettingsHook(
      "afterChange",
      async (settingsType, settings, changedData) => {
        if (!changedData) {
          return;
        }
        const room = `settingsType:${settingsType}`;
        if (settings._settingsType.config.editLog) {
          await app.orm.createEntry("editLog", {
            entryType: "settings",
            entryId: settingsType,
            action: "update",
            entryTitle: settingsType,
            user: settings._user?.id,
            editData: changedData,
          }, settings._user);
        }
        app.notify(room, "update", {
          settingsType,
          data: settings.data,
        });
      },
    );
    app.orm.addGlobalHook("afterDelete", async (entryType, entry) => {
      if (entryType === "editLog") {
        return;
      }
      const { titleField } = entry._entryType.config;
      const titleValue = titleField ? entry[titleField] : entry.id;
      await app.orm.createEntry("editLog", {
        entryType,
        entryId: entry.id,
        action: "delete",
        entryTitle: titleValue,
        user: entry._user?.id,
      });

      const room = `entryType:${entryType}`;
      const notifyData = {
        entryType,
        data: entry.data,
      };
      app.notify(`${room}:${entry.id}`, "delete", notifyData);
      app.notify(room, "list", {
        action: "delete",
        ...notifyData,
      });
    });
  },
};
