import type { BootAction } from "#/types.ts";
export const ormGlobalHooks: BootAction = {
  actionName: "addOrmGlobalHooks",
  description: "Create realtime rooms for each entity",
  action(app) {
    app.orm.addGlobalHook("afterInsert", async (entityId, entityRecord) => {
      if (entityId === "editLog") {
        return;
      }
      const { titleField } = entityRecord.entityDefinition.config;
      const titleValue = titleField
        ? entityRecord[titleField]
        : entityRecord.id;
      await app.orm.createEntity("editLog", {
        entity: entityId,
        recordId: entityRecord.id,
        action: "create",
        recordTitle: titleValue,
        user: entityRecord._user?.id,
        editData: entityRecord.data,
      });

      const room = `entity:${entityId}`;
      const notifyData = {
        entityId,
        data: entityRecord.data,
      };
      app.notify(room, "create", notifyData);
      app.notify(room, "list", {
        action: "create",
        ...notifyData,
      });
    });

    app.orm.addGlobalHook(
      "afterChange",
      async (entity, entityRecord, changedData) => {
        if (entity === "editLog") {
          return;
        }
        if (!changedData) {
          return;
        }
        if (entityRecord.entityDefinition.config.editLog) {
          const { titleField } = entityRecord.entityDefinition.config;
          const titleValue = titleField
            ? entityRecord[titleField]
            : entityRecord.id;

          await app.orm.createEntity("editLog", {
            entity,
            recordId: entityRecord.id,
            action: "update",
            recordTitle: titleValue,
            user: entityRecord._user?.id,
            editData: changedData,
          }, entityRecord._user);
        }
        const room = `entity:${entity}`;
        const notifyData = {
          entity,
          data: entityRecord.data,
        };
        app.notify(room, "update", notifyData);
        app.notify(room, "list", {
          action: "update",
          ...notifyData,
        });
      },
    );

    app.orm.addGlobalHook("afterDelete", async (entity, entityRecord) => {
      if (entity === "editLog") {
        return;
      }
      const { titleField } = entityRecord.entityDefinition.config;
      const titleValue = titleField
        ? entityRecord[titleField]
        : entityRecord.id;
      await app.orm.createEntity("editLog", {
        entity,
        recordId: entityRecord.id,
        action: "delete",
        recordTitle: titleValue,
        user: entityRecord._user?.id,
      });

      const room = `entity:${entity}`;
      const notifyData = {
        entity,
        data: entityRecord.data,
      };
      app.notify(room, "delete", notifyData);
      app.notify(room, "list", {
        action: "delete",
        ...notifyData,
      });
    });
  },
};
