import { BaseDefinition } from "#orm/entity/baseDefinition.ts";
import type { Choice, EasyEntityConfig, EasyField } from "@vef/types";
import type {
  EasyEntityHooks,
  EntityActionDefinition,
  EntityHook,
  EntityHookDefinition,
  EntityRecord,
} from "#orm/entity/entity/entityDefinition/entityDefTypes.ts";

export class EasyEntity extends BaseDefinition<EasyEntityConfig, "entity"> {
  readonly entityId: string;

  hooks: EasyEntityHooks;
  constructor(entityId: string, options?: {
    label?: string;
    description?: string;
  }) {
    super(entityId, options);
    this.entityId = this.key;

    this.config.tableName = this.entityId;
    this.config.idMethod = {
      type: "hash",
      hashLength: 16,
    };
    this.hooks = {
      beforeSave: [],
      afterSave: [],
      beforeInsert: [],
      afterInsert: [],
      validate: [],
      beforeValidate: [],
      beforeDelete: [],
      afterDelete: [],
    };
  }

  addHook(hook: EntityHook, definition: {
    label?: string;
    description?: string;

    action(
      entity: EntityRecord,
    ): Promise<void> | void;
  }) {
    this.hooks[hook].push(definition);
  }

  addAction<
    P extends string,
    K extends PropertyKey,
    C extends Choice<K>[],
    F extends Array<EasyField<P, K, C>>,
  >(
    actionName: string,
    actionDefinition: EntityActionDefinition<F>,
  ) {
    this.actions.push(
      {
        key: actionName,
        ...actionDefinition,
      } as EntityActionDefinition & { key: string },
    );
  }
}
