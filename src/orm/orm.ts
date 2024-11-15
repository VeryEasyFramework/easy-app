import { Database, type DatabaseConfig } from "#orm/database/database.ts";
import { type BasicFgColor, ColorMe } from "@vef/easy-cli";

import type {
  CountGroupedResult,
  CountOptions,
  EasyFieldType,
  EasyFieldTypeMap,
  EntryTypeDef,
  ListOptions,
  ReportOptions,
  RowsResult,
  SafeType,
} from "@vef/types";

import { raiseOrmException } from "#orm/ormException.ts";
import { migrateEntryType } from "#orm/database/migrate/migrateEntity.ts";

import { installDatabase } from "#orm/database/install/installDatabase.ts";
import type { EntryType } from "#orm/entry/entry/entryType/entryType.ts";
import { buildEntryType } from "#orm/entry/entry/entryType/buildEasyEntity.ts";
import { validateEntityDefinition } from "#orm/entry/entry/entryType/validateEntryType.ts";
import { FetchRegistry } from "#orm/entry/registry.ts";
import { buildEntryClass } from "#orm/entry/entry/entryClass/buildEntryClass.ts";
import type { EntryClass } from "#orm/entry/entry/entryClass/entryClass.ts";
import type { SettingsTypeDef, User } from "@vef/types";

import { migrateSettingsEntity } from "#orm/database/migrate/migrateSettingsEntity.ts";
import type { SettingsClass } from "#orm/entry/settings/settingsRecord.ts";
import { buildSettingsType } from "#orm/entry/settings/buildSettingsEntity.ts";
import { buildSettingsRecordClass } from "#orm/entry/settings/buildSettingsRecordClass.ts";
import type { SettingsType } from "#orm/entry/settings/settingsEntity.ts";
import type { EasyApp } from "#/app/easyApp.ts";
import type { Settings } from "#orm/entry/settings/settingsRecordTypes.ts";
import type { Entry } from "#orm/entry/entry/entryType/entry.ts";

type GlobalHook = (
  entryType: string,
  entry: Entry,
) => Promise<void> | void;

type GlobalSettingsHook = {
  (
    settingsType: string,
    settings: Settings,
  ): Promise<void> | void;
};

type GlobalSettingsSaveHook = (
  settingsType: string,
  settings: Settings,
  changedData: Record<string, any> | undefined,
) => Promise<void> | void;
type GlobalSaveHook = (
  entryType: string,
  entry: Entry,
  changedData: Record<string, any> | undefined,
) => Promise<void> | void;
interface GlobalHooks {
  beforeInsert: GlobalHook[];
  afterInsert: GlobalHook[];
  beforeSave: GlobalHook[];
  afterSave: GlobalHook[];
  afterChange: GlobalSaveHook[];
  validate: GlobalHook[];
  beforeValidate: GlobalHook[];

  afterDelete: GlobalHook[];
}

interface GlobalSettingsHooks {
  beforeSave: GlobalSettingsHook[];
  afterSave: GlobalSettingsHook[];
  afterChange: GlobalSettingsSaveHook[];
  validate: GlobalSettingsHook[];
  beforeValidate: GlobalSettingsHook[];
}

interface SettingsHookMap {
  beforeSave: GlobalSettingsHook;
  afterSave: GlobalSettingsHook;
  validate: GlobalSettingsHook;
  beforeValidate: GlobalSettingsHook;
  afterChange: GlobalSettingsSaveHook;
}

interface HookMap {
  beforeInsert: GlobalHook;
  afterInsert: GlobalHook;
  beforeSave: GlobalHook;
  afterSave: GlobalHook;
  afterChange: GlobalSaveHook;
  validate: GlobalHook;
  beforeValidate: GlobalHook;
  afterDelete: GlobalHook;
}
export class EasyOrm<D extends keyof DatabaseConfig = keyof DatabaseConfig> {
  entryTypesList: Array<EntryType> = [];
  entryTypes: Record<string, EntryTypeDef> = {};
  settingsTypes: Record<string, SettingsTypeDef> = {};

  settingsTypesList: Array<SettingsType> = [];
  entryClasses: Record<string, typeof EntryClass> = {};
  settingsClasses: Record<string, typeof SettingsClass> = {};
  app: EasyApp;
  private globalHooks: GlobalHooks = {
    beforeInsert: [],
    afterInsert: [],
    beforeSave: [],
    afterSave: [],
    validate: [],
    beforeValidate: [],
    afterChange: [],
    afterDelete: [],
  };

  private globalSettingsHooks: GlobalSettingsHooks = {
    beforeSave: [],
    afterSave: [],
    validate: [],
    beforeValidate: [],
    afterChange: [],
  };
  private initialized: boolean = false;

  registry: FetchRegistry;

  database: Database<D>;
  dbType: D;

  idFieldType: EasyFieldType = "IDField";
  constructor(options: {
    entryTypes?: EntryType[];
    databaseType: D;
    databaseConfig: DatabaseConfig[D];
    app: EasyApp;
    idFieldType?: EasyFieldType;
  }) {
    this.app = options.app;
    this.registry = new FetchRegistry();
    this.dbType = options.databaseType;
    if (options.idFieldType) {
      this.idFieldType = options.idFieldType;
    }
    this.database = new Database({
      adapter: options.databaseType,
      config: options.databaseConfig,
      idFieldType: this.idFieldType,
    });
    if (options.entryTypes) {
      for (const entryType of options.entryTypes) {
        this.addEntryType(entryType);
      }
    }
  }

  async init() {
    await this.database.init();
    this.initialized = true;
    this.buildEntryTypes();
    this.validateEntryTypes();
    this.createEntryClasses();

    this.buildSettingsTypes();
    this.createSettingsClasses();
  }
  stop() {
    this.database.stop();
  }

  addEntryType(entryType: EntryType) {
    if (this.initialized) {
      raiseOrmException(
        "InvalidOperation",
        "Cannot add Entry Type after initialization",
      );
    }
    if (this.hasEntryType(entryType.entryType)) {
      raiseOrmException(
        "InvalidOperation",
        `Entry Type with id ${entryType.entryType} already exists!`,
      );
    }
    this.entryTypesList.push(entryType);
  }

  addSettingsType(settingsType: SettingsType) {
    if (this.initialized) {
      raiseOrmException(
        "InvalidOperation",
        "Cannot add Entry Type after initialization",
      );
    }
    if (this.hasSettingsType(settingsType.settingsType)) {
      raiseOrmException(
        "InvalidOperation",
        `Settings Type with id ${settingsType.settingsType} already exists!`,
      );
    }
    this.settingsTypesList.push(settingsType);
  }

  async runGlobalHook<H extends keyof GlobalHooks>(
    hook: H,
    entryType: string,
    entry: EntryClass,
    changedData?: Record<string, any>,
  ) {
    for (const callback of this.globalHooks[hook]) {
      await callback(entryType, entry, changedData);
    }
  }

  async runGlobalSettingsHook<H extends keyof GlobalSettingsHooks>(
    hook: H,
    settingsType: string,
    settings: SettingsClass,
    changedData?: Record<string, any>,
  ) {
    for (const callback of this.globalSettingsHooks[hook]) {
      await callback(settingsType, settings, changedData);
    }
  }
  addGlobalSettingsHook<H extends keyof GlobalSettingsHooks>(
    hook: H,
    callback: SettingsHookMap[H],
  ) {
    (this.globalSettingsHooks[hook] as SettingsHookMap[H][]).push(callback);
  }
  addGlobalHook<H extends keyof GlobalHooks>(
    hook: H,
    callback: HookMap[H],
  ) {
    (this.globalHooks[hook] as HookMap[H][]).push(callback);
  }
  private buildEntryTypes() {
    for (const entryType of this.entryTypesList) {
      const entryTypeDef = buildEntryType(this, entryType);
      this.entryTypes[entryTypeDef.entryType] = entryTypeDef;
    }
  }

  private buildSettingsTypes() {
    for (const settingsType of this.settingsTypesList) {
      const settingsTypeDef = buildSettingsType(
        this,
        settingsType,
      );
      this.settingsTypes[settingsTypeDef.settingsType] = settingsTypeDef;
    }
  }
  private validateEntryTypes() {
    for (const entryType of Object.values(this.entryTypes)) {
      validateEntityDefinition(this, entryType);
    }
  }

  private createEntryClasses() {
    for (const entryType of Object.values(this.entryTypes)) {
      const entryClass = buildEntryClass(this, entryType);
      this.entryClasses[entryType.entryType] = entryClass;
    }
  }

  private createSettingsClasses() {
    for (
      const settingsType of Object.values(
        this.settingsTypes,
      )
    ) {
      const settingsClass = buildSettingsRecordClass(
        this,
        settingsType,
      );
      this.settingsClasses[settingsType.settingsType] = settingsClass;
    }
  }
  async install() {
    await installDatabase({
      database: this.database,
    });
  }
  async migrate(options?: {
    onProgress?: (progress: number, total: number, message: string) => void;
  }): Promise<string[]> {
    const message = (message: string, color?: BasicFgColor) => {
      return ColorMe.fromOptions(message, { color });
    };

    const entryTypes = Object.values(this.entryTypes);
    const results: string[] = [];
    const total = entryTypes.length;
    const progress = options?.onProgress || (() => {});
    progress(0, total, message("Validating installation", "brightYellow"));
    await this.install();
    progress(0, total, message("Installation validated", "brightGreen"));

    let count = 0;
    for (const entryType of entryTypes) {
      progress(
        count,
        total,
        message(`Migrating ${entryType.entryType}`, "brightBlue"),
      );

      await migrateEntryType({
        database: this.database,
        entryType,
        onOutput: (message) => {
          progress(count, total, message);
        },
      });
      progress(
        ++count,
        total,
        message(`Migrated ${entryType.entryType}`, "brightGreen"),
      );
    }
    for (const settingsEntity of this.settingsTypesList) {
      await migrateSettingsEntity({
        database: this.database,
        settingsEntity,
        onOutput: (message) => {
          progress(count, total, message);
        },
      });
    }
    return results;
  }

  /**
   * Get an entry by id
   */
  async getEntry<E extends Entry = Entry>(
    entryType: string,
    id: EasyFieldTypeMap["IDField"],
    user?: User,
  ): Promise<E> {
    const entryClass = this.getEntryClass(entryType);

    const entry = new entryClass();
    entry._user = user;
    await entry.load(id);
    return entry as E;
  }

  /**
   * Create an new entry
   */
  async createEntity(
    entryType: string,
    data: Record<string, SafeType | undefined>,
    user?: User,
  ): Promise<Entry> {
    const entryClass = this.getEntryClass(entryType);

    const entry = new entryClass();
    entry._user = user;
    entry.update(data);
    await entry.save();
    return entry;
  }

  /**
   * Update an entry
   */
  async updateEntry(
    entryType: string,
    id: string,
    data: Record<string, SafeType>,
    user?: User,
  ): Promise<Entry> {
    const entry = await this.getEntry(entryType, id, user);
    entry.update(data);
    await entry.save();
    return entry;
  }

  /**
   * Delete an entry
   */
  async deleteEntity(
    entryType: string,
    id: string | number,
    user?: User,
  ): Promise<boolean> {
    const entry = await this.getEntry(entryType, id as string, user);
    await entry.delete();
    return true;
  }

  /**
   * Get a list of entities
   */
  async getEntryList<E extends Record<string, any> = Record<string, any>>(
    entryType: string,
    options?: ListOptions,
    user?: User,
  ): Promise<RowsResult<E>> {
    const entryTypeDef = this.getEntryType(entryType);

    options = options || {};
    if (!options.columns) {
      options.columns = entryTypeDef.listFields as string[];
    }
    if (!options.limit) {
      options.limit = 100;
    }

    const result = await this.database.getRows<E>(
      entryTypeDef.config.tableName,
      options,
    );
    return result;
  }

  async getReport(entryType: string, options: ReportOptions) {
    const entryTypeDef = this.getEntryType(entryType);
    const result = await this.database.getReport(
      entryTypeDef.config.tableName,
      options,
    );
  }
  /**
   * Find an entry by a filter. Returns the first entry that matches the filter
   */
  async findEntity(
    entryType: string,
    filter: Required<ListOptions["filter"]>,
  ): Promise<Entry | null> {
    const entryTypeDef = this.getEntryType(entryType);
    const result = await this.database.getRows<Record<string, SafeType>>(
      entryTypeDef.config.tableName,
      {
        filter,
        columns: ["id"],
      },
    );
    if (result.rowCount === 0) {
      return null;
    }
    const id = result.data[0].id as string;
    return await this.getEntry(entryType, id);
  }

  async count(
    entryType: string,
    options?: CountOptions,
  ): Promise<number> {
    const entryTypeDef = this.getEntryType(entryType);
    const total = await this.database.count(
      entryTypeDef.config.tableName,
      options,
    );

    return total;
  }

  async countGrouped<
    P extends PropertyKey,
    K extends Array<P>,
    R extends
      & {
        [key in K[number]]: string;
      }
      & {
        count: number;
      },
  >(
    entryType: string,
    groupBy: K,
    options?: CountOptions,
  ): Promise<Array<R>> {
    const entryTypeDef = this.getEntryType(entryType);
    for (const item of groupBy) {
      const field = entryTypeDef.fields.find((f) => f.key === item);
      if (!field) {
        raiseOrmException(
          "InvalidField",
          `Field ${item as string} does not exist in Entry Type ${entryType}`,
        );
      }
    }

    const result = await this.database.countGrouped<K>(
      entryTypeDef.config.tableName,
      groupBy,
      options,
    );
    return result as Array<R>;
  }
  async getValue<T = SafeType>(
    entryType: string,
    id: string,
    field: string,
  ): Promise<T> {
    const entryTypeDef = this.getEntryType(entryType);
    const result = await this.database.getValue<T>(
      entryTypeDef.config.tableName,
      id,
      field,
    );
    return result;
  }
  async batchUpdateField(
    entryType: string,
    field: string,
    value: any,
    filters: Record<string, any>,
  ) {
    const entryTypeDef: EntryTypeDef = this.getEntryType(entryType);
    await this.database.batchUpdateField(
      entryTypeDef.config.tableName,
      field,
      value,
      filters,
    );
  }
  /**
   *  Getters for entry types
   */

  getEntryTypeSource(entryType: string): EntryType {
    const entryTypeDef = this.entryTypesList.find((e) =>
      e.entryType === entryType
    );
    if (!entryTypeDef) {
      raiseOrmException(
        "EntryTypeNotFound",
        `Entry Type '${entryType}' is not a registered entry type!`,
      );
    }
    return entryTypeDef;
  }
  getEntryType(entryType: string): EntryTypeDef {
    const entryTypeDef = this.entryTypes[entryType];
    if (!entryTypeDef) {
      raiseOrmException(
        "EntryTypeNotFound",
        `Entry Type '${entryType}' is not a registered entry type!`,
      );
    }
    return entryTypeDef;
  }

  private getEntryClass<
    E extends typeof EntryClass = typeof EntryClass,
  >(
    entryType: string,
  ): E {
    const entryClass = this.entryClasses[entryType];
    if (!entryClass) {
      raiseOrmException(
        "EntryTypeNotFound",
        `Entry Type '${entryType}' is not a registered  entry type!`,
      );
    }
    return entryClass as E;
  }

  /**
   * Validation helpers
   */

  hasEntryType(entryType: string): boolean {
    if (entryType in this.entryTypes) {
      return true;
    }
    return false;
  }

  hasSettingsType(settingsType: string): boolean {
    if (settingsType in this.settingsTypes) {
      return true;
    }
    return false;
  }
  async exists(entryType: string, id: string): Promise<boolean> {
    if (!this.hasEntryType(entryType)) {
      return false;
    }

    const entryTypeDef = this.getEntryType(entryType);
    const result = await this.database.getRow<Record<string, SafeType>>(
      entryTypeDef.config.tableName,
      "id",
      id,
    );
    return result ? true : false;
  }

  /**
   * Settings Types methods
   */

  async getSettings(
    settingsType: string,
    user?: User,
  ): Promise<Settings> {
    const settingsClass = this.getSettingsClass(settingsType);
    const settings = new settingsClass();
    settings._user = user;
    await settings.load();
    return settings;
  }

  async updateSettings(
    settingsId: string,
    data: Record<string, any>,
    user?: User,
  ): Promise<Settings> {
    const settingsRecord = await this.getSettings(settingsId, user);
    settingsRecord.update(data);
    await settingsRecord.save();
    return settingsRecord;
  }
  private getSettingsClass(settingsId: string): typeof SettingsClass {
    const settingsClass = this.settingsClasses[settingsId];
    if (!settingsClass) {
      raiseOrmException(
        "EntryTypeNotFound",
        `Settings Type '${settingsId}' is not a registered settings type!`,
      );
    }
    return settingsClass;
  }

  getSettingsEntity(settingsId: string): SettingsTypeDef {
    const settingsEntity = this.settingsTypes[settingsId];
    if (!settingsEntity) {
      raiseOrmException(
        "EntryTypeNotFound",
        `Settings Type '${settingsId}' is not a registered settings type!`,
      );
    }
    return settingsEntity;
  }
}
