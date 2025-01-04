import type { EntityType } from "#/concepts/entity/entityType.ts";
import type { AccountType } from "#/concepts/account/accountType.ts";

export class ModulePack {
  moduleName: string;
  entities: Map<string, EntityType> = new Map();
  accounts: Map<string, AccountType> = new Map();
  constructor(moduleName: string, config: ModulePackConfig) {
    this.moduleName = moduleName;
    for (const entity of config.entities || []) {
      this.entities.set(entity.entityName, entity);
    }
    for (const accountType of config.accountTypes || []) {
      this.accounts.set(accountType.accountName, accountType);
    }
  }
}

type ModulePackConfig = {
  description?: string;
  entities?: Array<EntityType>;
  accountTypes?: Array<AccountType>;
};
