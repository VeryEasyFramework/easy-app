import { Database, type DatabaseConfig } from "#orm/database/database.ts";
import { type BasicFgColor, ColorMe } from "@vef/easy-cli";

import type {
  EasyFieldType,
  EasyFieldTypeMap,
  EntityDefinition,
  ListOptions,
  RowsResult,
  SafeType,
} from "@vef/types";

import { raiseOrmException } from "#orm/ormException.ts";
import { migrateEntity } from "#orm/database/migrate/migrateEntity.ts";

import { installDatabase } from "#orm/database/install/installDatabase.ts";
import type { EasyEntity } from "#orm/entity/entity/entityDefinition/easyEntity.ts";
import { buildEasyEntity } from "#orm/entity/entity/entityDefinition/buildEasyEntity.ts";
import { validateEntityDefinition } from "#orm/entity/entity/entityDefinition/validateEasyEntity.ts";
import { FetchRegistry } from "#orm/entity/registry.ts";
import { buildRecordClass } from "#orm/entity/entity/entityRecord/buildRecordClass.ts";
import type { EntityRecord } from "#orm/entity/entity/entityRecord/entityRecord.ts";
import type { SettingsEntityDefinition, User } from "@vef/types";

import { migrateSettingsEntity } from "#orm/database/migrate/migrateSettingsEntity.ts";
import type { SettingsRecordClass } from "#orm/entity/settings/settingsRecord.ts";
import { buildSettingsEntity } from "#orm/entity/settings/buildSettingsEntity.ts";
import { buildSettingsRecordClass } from "#orm/entity/settings/buildSettingsRecordClass.ts";
import type { SettingsEntity } from "#orm/entity/settings/settingsEntity.ts";
import type { EasyApp } from "#/app/easyApp.ts";

type GlobalHook = (
  entityId: string,
  record: EntityRecord,
) => Promise<void> | void;

type GlobalSettingsHook = {
  (
    settingsId: string,
    record: SettingsRecordClass,
  ): Promise<void> | void;
};

type GlobalSettingsSaveHook = (
  settingsId: string,
  record: SettingsRecordClass,
  changedData: Record<string, any> | undefined,
) => Promise<void> | void;
type GlobalSaveHook = (
  entityId: string,
  record: EntityRecord,
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
  easyEntities: Array<EasyEntity> = [];
  entities: Record<string, EntityDefinition> = {};
  settingsDefinitions: Record<string, SettingsEntityDefinition> = {};

  settingsEntities: Array<SettingsEntity> = [];
  entityClasses: Record<string, typeof EntityRecord> = {};
  settingsClasses: Record<string, typeof SettingsRecordClass> = {};
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
    entities?: EasyEntity[];
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
    if (options.entities) {
      for (const entity of options.entities) {
        this.addEntity(entity);
      }
    }
  }

  async init() {
    await this.database.init();
    this.initialized = true;
    this.buildEntities();
    this.validateEntities();
    this.createEntityClasses();

    this.buildSettingsEntities();
    this.createSettingsClasses();
  }
  stop() {
    this.database.stop();
  }

  addEntity(entity: EasyEntity) {
    if (this.initialized) {
      raiseOrmException(
        "InvalidOperation",
        "Cannot add entity after initialization",
      );
    }
    if (this.hasEntity(entity.entityId)) {
      raiseOrmException(
        "InvalidOperation",
        `Entity with id ${entity.entityId} already exists!`,
      );
    }
    this.easyEntities.push(entity);
  }

  addSettingsEntity(entity: SettingsEntity) {
    if (this.initialized) {
      raiseOrmException(
        "InvalidOperation",
        "Cannot add entity after initialization",
      );
    }
    if (this.hasSettingsEntity(entity.settingsId)) {
      raiseOrmException(
        "InvalidOperation",
        `Settings entity with id ${entity.settingsId} already exists!`,
      );
    }
    this.settingsEntities.push(entity);
  }

  async runGlobalHook<H extends keyof GlobalHooks>(
    hook: H,
    entityId: string,
    record: EntityRecord,
    changedData?: Record<string, any>,
  ) {
    for (const callback of this.globalHooks[hook]) {
      await callback(entityId, record, changedData);
    }
  }

  async runGlobalSettingsHook<H extends keyof GlobalSettingsHooks>(
    hook: H,
    settingsId: string,
    record: SettingsRecordClass,
    changedData?: Record<string, any>,
  ) {
    for (const callback of this.globalSettingsHooks[hook]) {
      await callback(settingsId, record, changedData);
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
  private buildEntities() {
    for (const entity of this.easyEntities) {
      const entityDefinition = buildEasyEntity(this, entity);
      this.entities[entityDefinition.entityId] = entityDefinition;
    }
  }

  private buildSettingsEntities() {
    for (const settingsEntity of this.settingsEntities) {
      const settingsEntityDefinition = buildSettingsEntity(
        this,
        settingsEntity,
      );
      this.settingsDefinitions[settingsEntityDefinition.settingsId] =
        settingsEntityDefinition;
    }
  }
  private validateEntities() {
    for (const entityDefinition of Object.values(this.entities)) {
      validateEntityDefinition(this, entityDefinition);
    }
  }

  private createEntityClasses() {
    for (const entityDefinition of Object.values(this.entities)) {
      const entityRecordClass = buildRecordClass(this, entityDefinition);
      this.entityClasses[entityDefinition.entityId] = entityRecordClass;
    }
  }

  private createSettingsClasses() {
    for (
      const settingsEntityDefinition of Object.values(
        this.settingsDefinitions,
      )
    ) {
      const settingsRecordClass = buildSettingsRecordClass(
        this,
        settingsEntityDefinition,
      );
      this.settingsClasses[settingsEntityDefinition.settingsId] =
        settingsRecordClass;
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

    const entities = Object.values(this.entities);
    const results: string[] = [];
    const total = entities.length;
    const progress = options?.onProgress || (() => {});
    progress(0, total, message("Validating installation", "brightYellow"));
    await this.install();
    progress(0, total, message("Installation validated", "brightGreen"));

    let count = 0;
    for (const entity of entities) {
      progress(
        count,
        total,
        message(`Migrating ${entity.entityId}`, "brightBlue"),
      );

      await migrateEntity({
        database: this.database,
        entity,
        onOutput: (message) => {
          progress(count, total, message);
        },
      });
      progress(
        ++count,
        total,
        message(`Migrated ${entity.entityId}`, "brightGreen"),
      );
    }
    for (const settingsEntity of this.settingsEntities) {
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
   * Get an entity by id
   */
  async getEntity<E extends EntityRecord = EntityRecord>(
    entityId: string,
    id: EasyFieldTypeMap["IDField"],
    user?: User,
  ): Promise<E> {
    const entityClass = this.getEntityClass(entityId);

    const entityRecord = new entityClass();
    entityRecord._user = user;
    await entityRecord.load(id);
    return entityRecord as E;
  }

  /**
   * Create an new entity
   */
  async createEntity(
    entityId: string,
    data: Record<string, SafeType | undefined>,
    user?: User,
  ): Promise<EntityRecord> {
    const entityClass = this.getEntityClass(entityId);

    const entityRecord = new entityClass();
    entityRecord._user = user;
    entityRecord.update(data);
    await entityRecord.save();
    return entityRecord;
  }

  /**
   * Update an entity
   */
  async updateEntity(
    entityId: string,
    id: string,
    data: Record<string, SafeType>,
    user?: User,
  ): Promise<EntityRecord> {
    const entityRecord = await this.getEntity(entityId, id, user);
    entityRecord.update(data);
    await entityRecord.save();
    return entityRecord;
  }

  /**
   * Delete an entity
   */
  async deleteEntity(
    entityId: string,
    id: string | number,
    user?: User,
  ): Promise<boolean> {
    const entityRecord = await this.getEntity(entityId, id as string, user);
    await entityRecord.delete();
    return true;
  }

  /**
   * Get a list of entities
   */
  async getEntityList<E extends Record<string, any> = Record<string, any>>(
    entityId: string,
    options?: ListOptions,
    user?: User,
  ): Promise<RowsResult<E>> {
    const entityDef = this.getEntityDef(entityId);

    options = options || {};
    if (!options.columns) {
      options.columns = entityDef.listFields as string[];
    }
    if (!options.limit) {
      options.limit = 100;
    }

    const result = await this.database.getRows<E>(
      entityDef.config.tableName,
      options,
    );
    return result;
  }

  /**
   * Find an entity by a filter. Returns the first entity that matches the filter
   */
  async findEntity(
    entityId: string,
    filter: Required<ListOptions["filter"]>,
  ): Promise<EntityRecord | null> {
    const entityDef = this.getEntityDef(entityId);
    const result = await this.database.getRows<Record<string, SafeType>>(
      entityDef.config.tableName,
      {
        filter,
        columns: ["id"],
      },
    );
    if (result.rowCount === 0) {
      return null;
    }
    const id = result.data[0].id as string;
    return await this.getEntity(entityId, id);
  }

  async countEntities(
    entityId: string,
    options?: {
      filter: ListOptions["filter"];
      orFilter?: ListOptions["orFilter"];
    },
  ): Promise<number> {
    const entityDef = this.getEntityDef(entityId);
    const result = await this.database.getRows(entityDef.config.tableName, {
      filter: options?.filter,
      orFilter: options?.orFilter,
      columns: ["id"],
    });

    return result.totalCount;
  }

  async getValue<T = SafeType>(
    entityId: string,
    id: string,
    field: string,
  ): Promise<T> {
    const entityDef = this.getEntityDef(entityId);
    const result = await this.database.getValue<T>(
      entityDef.config.tableName,
      id,
      field,
    );
    return result;
  }
  async batchUpdateField(
    entityId: string,
    field: string,
    value: any,
    filters: Record<string, any>,
  ) {
    const entityDef: EntityDefinition = this.getEntityDef(entityId);
    await this.database.batchUpdateField(
      entityDef.config.tableName,
      field,
      value,
      filters,
    );
  }
  /**
   *  Getters for entity definitions
   */

  getEasyEntityDef(entityId: string): EasyEntity {
    const entity = this.easyEntities.find((e) => e.entityId === entityId);
    if (!entity) {
      raiseOrmException(
        "EntityNotFound",
        `Entity '${entityId}' is not a registered entity!`,
      );
    }
    return entity;
  }
  getEntityDef(entityId: string): EntityDefinition {
    const def = this.entities[entityId];
    if (!def) {
      raiseOrmException(
        "EntityNotFound",
        `Entity '${entityId as string}' is not a registered entity!`,
      );
    }
    return def;
  }

  private getEntityClass<E extends typeof EntityRecord = typeof EntityRecord>(
    entityId: string,
  ): E {
    const entityClass = this.entityClasses[entityId];
    if (!entityClass) {
      raiseOrmException(
        "EntityNotFound",
        `Entity '${entityId}' is not a registered entity!`,
      );
    }
    return entityClass as E;
  }

  /**
   * Validation helpers
   */

  hasEntity(entity: string): boolean {
    if (entity in this.entities) {
      return true;
    }
    return false;
  }

  hasSettingsEntity(entity: string): boolean {
    if (entity in this.settingsDefinitions) {
      return true;
    }
    return false;
  }
  async exists(entityId: string, id: string): Promise<boolean> {
    if (!this.hasEntity(entityId)) {
      return false;
    }

    const entityDef = this.getEntityDef(entityId);
    const result = await this.database.getRow<Record<string, SafeType>>(
      entityDef.config.tableName,
      "id",
      id,
    );
    return result ? true : false;
  }

  /**
   * Settings entity methods
   */

  async getSettings(
    settingsId: string,
    user?: User,
  ): Promise<SettingsRecordClass> {
    const settingsClass = this.getSettingsClass(settingsId);
    const settingsRecord = new settingsClass();
    settingsRecord._user = user;
    await settingsRecord.load();
    return settingsRecord;
  }

  async updateSettings(
    settingsId: string,
    data: Record<string, any>,
    user?: User,
  ): Promise<SettingsRecordClass> {
    const settingsRecord = await this.getSettings(settingsId, user);
    settingsRecord.update(data);
    await settingsRecord.save();
    return settingsRecord;
  }
  private getSettingsClass(settingsId: string): typeof SettingsRecordClass {
    const settingsClass = this.settingsClasses[settingsId];
    if (!settingsClass) {
      raiseOrmException(
        "EntityNotFound",
        `Settings entity '${settingsId}' is not a registered entity!`,
      );
    }
    return settingsClass;
  }

  getSettingsEntity(settingsId: string): SettingsEntityDefinition {
    const settingsEntity = this.settingsDefinitions[settingsId];
    if (!settingsEntity) {
      raiseOrmException(
        "EntityNotFound",
        `Settings entity '${settingsId}' is not a registered entity!`,
      );
    }
    return settingsEntity;
  }
}
