import { BaseDefinition } from "#orm/entry/baseDefinition.ts";
import type { Choice, EasyField, EntryTypeConfig } from "@vef/types";
import type {
  Entry,
  EntryActionDefinition,
  EntryHook,
  EntryHookDefinition,
  EntryHooks,
} from "#orm/entry/entry/entryType/entry.ts";
import type { Permission } from "#orm/entry/permission/permissionTypes.ts";
import { toCamelCase, toTitleCase } from "@vef/string-utils";
import { raiseEasyException } from "#/easyException.ts";

export class EntryType extends BaseDefinition<EntryTypeConfig, "entry"> {
  readonly entryType: string;

  roles: Map<string, Permission> = new Map();

  hooks: EntryHooks;
  constructor(entityId: string, options?: {
    label?: string;
    description?: string;
  }) {
    super(entityId, options);
    this.setPermission({
      role: "systemAdmin",
      read: true,
      write: true,
      create: true,
      delete: true,
    });
    this.entryType = this.key;

    this.config.tableName = this.entryType;
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

  addHook(hook: EntryHook, definition: {
    label?: string;
    description?: string;

    action(
      entity: Entry,
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
    actionDefinition: EntryActionDefinition<F>,
  ) {
    this.actions.push(
      {
        key: actionName,
        ...actionDefinition,
      } as EntryActionDefinition & { key: string },
    );
  }

  setPermission(permission: Permission) {
    const roleId = toCamelCase(permission.role);
    const roleName = toTitleCase(permission.role);
    permission.role = roleName;
    if (this.roles.has(roleId)) {
      raiseEasyException(
        `Role ${roleName} already exists in entity ${this.entryType}`,
        400,
      );
    }
    this.roles.set(roleId, permission);
  }
}
