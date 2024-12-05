import { EasyField } from "../../../../vef-types/mod.ts";

export interface RegisterConfig {
  source: {
    entryType: string;

    field: PropertyKey;
  };
  target: {
    entryType: string;
    idKey: PropertyKey;
    field: PropertyKey;
  };
}

interface Registry {
  [key: string]: {
    [key: PropertyKey]: {
      entryType: string;
      idKey: PropertyKey;
      field: PropertyKey;
    }[];
  };
}
interface ConnectionRegistry {
  [key: string]: [];
}

export class FetchRegistry {
  registry: Registry = {};
  connectionRegistry: ConnectionRegistry = {};
  registerFetchField(config: RegisterConfig) {
    if (!this.registry[config.target.entryType]) {
      this.registry[config.target.entryType] = {};
    }
    if (!this.registry[config.target.entryType][config.target.field]) {
      this.registry[config.target.entryType][config.target.field] = [];
    }

    this.registry[config.target.entryType][config.target.field].push({
      entryType: config.source.entryType,
      idKey: config.target.idKey,
      field: config.source.field,
    });
  }

  registerConnectionField(
    entryType: string,
    foreignEntryType: string,
    fieldKey: string,
  ) {
  }
  findInRegistry(entryType: string): Registry[string] | undefined {
    return this.registry[entryType];
  }
}
