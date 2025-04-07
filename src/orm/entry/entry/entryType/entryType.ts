import { BaseDefinition } from "#orm/entry/baseDefinition.ts";
import type { Choice, EasyField, EntryTypeConfig } from "#/vef-types/mod.ts";
import type {
  Entry,
  Entry as EntryInstance,
  EntryActionDefinition,
  EntryHook,
  EntryHooks,
  TypedEntry,
} from "#orm/entry/entry/entryType/entry.ts";
import type { Permission } from "#orm/entry/permission/permissionTypes.ts";
import {
  camelToSnakeCase,
  toCamelCase,
  toPascalCase,
  toTitleCase,
} from "@vef/string-utils";
import { raiseEasyException } from "#/easyException.ts";
import { fieldTypeMap } from "#orm/entry/field/fieldTypeMap.ts";

export class EntryType<T extends Entry = Entry>
  extends BaseDefinition<EntryTypeConfig<keyof T>, "entry"> {
  readonly entryType: string;

  roles: Map<string, Permission> = new Map();

  hooks: EntryHooks;
  constructor(entryType: string, options?: {
    label?: string;
    description?: string;
  }) {
    super(entryType, options);
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
      entry: TypedEntry<T>,
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
    actionDefinition: EntryActionDefinition<T, F>,
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
        `Role ${roleName} already exists in entry type ${this.entryType}`,
        400,
      );
    }
    this.roles.set(roleId, permission);
  }

  generateType() {
    const fields = this.fields.map((field) => {
      let fieldType = fieldTypeMap[field.fieldType];
      if (field.fieldType === "ChoicesField") {
        fieldType = field.choices?.map((choice) => {
          if (typeof choice.key === "number") {
            return choice.key.toString();
          }
          return `'${choice.key as string}'`;
        }).join(" | ") || "string";
      }
      if (!fieldType) {
        raiseEasyException(
          `Field type ${field.fieldType} does not exist`,
          400,
        );
      }
      const { label, description, required } = field;
      const descriptionDoc = description
        ? ` * @description ${description}`
        : "";
      const doc = [
        `/**`,
        ` * **${label || ""}** (${field.fieldType})`,
      ];
      if (description) {
        doc.push(` * @description ${description}`);
      }
      doc.push(` * @type {${fieldType}}`);
      if (required) {
        doc.push(` * @required ${required}`);
      }
      doc.push(` */`);
      const row = [
        `${field.key}${required ? "" : "?"}: ${fieldType};`,
      ];

      return [...doc, ...row].join("\n");
    });
    const childFields = this.children.map((child) => {
      const childName = toPascalCase(child.childName);
      const childFields = child.fields.map((field) => {
        let fieldType = fieldTypeMap[field.fieldType];
        if (field.fieldType === "ChoicesField") {
          fieldType = field.choices?.map((choice) => {
            if (typeof choice.key === "number") {
              return choice.key.toString();
            }
            return `'${choice.key as string}'`;
          }).join(" | ") || "string";
        }
        if (!fieldType) {
          raiseEasyException(
            `Field type ${field.fieldType} does not exist`,
            400,
          );
        }
        const { label, description, required } = field;
        const descriptionDoc = description
          ? ` * @description ${description}`
          : "";
        const doc = [
          `/**`,
          ` * **${label || ""}** (${field.fieldType})`,
        ];
        if (description) {
          doc.push(` * @description ${description}`);
        }
        doc.push(` * @type {${fieldType}}`);
        if (required) {
          doc.push(` * @required ${required}`);
        }
        doc.push(` */`);
        const row = [
          `${field.key}${required ? "" : "?"}: ${fieldType};`,
        ];

        return [...doc, ...row].join("\n");
      });
      return `${child.childName}: ChildList<{${childFields.join("\n")}}>;`;
    });
    const fieldsWithChildren = [...fields, ...childFields];

    const writeFilePath =
      `${Deno.cwd()}/generatedTypes/${this.entryType}Interface.ts`;
    const name = camelToSnakeCase(this.entryType);
    const rows: string[] = [];
    rows.push('import type { Entry } from "@vef/easy-app";');
    if (this.children.length > 0) {
      rows.push(`import type { ChildList } from "@vef/easy-app";`);
    }
    rows.push(`export interface ${toPascalCase(name)} extends Entry {`);
    rows.push(...fieldsWithChildren);
    rows.push("}");
    Deno.mkdirSync(`${Deno.cwd()}/generatedTypes`, {
      recursive: true,
    });
    Deno.writeTextFileSync(
      writeFilePath,
      rows.join("\n"),
      {},
    );
  }
}
