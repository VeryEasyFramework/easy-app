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

export class FetchRegistry {
  registry: Registry = {};
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
  findInRegistry(entryType: string): Registry[string] | undefined {
    return this.registry[entryType];
  }
}
