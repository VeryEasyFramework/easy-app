export interface RegisterConfig {
  source: {
    entity: string;

    field: PropertyKey;
  };
  target: {
    entity: string;
    idKey: PropertyKey;
    field: PropertyKey;
  };
}

interface Registry {
  [key: string]: {
    [key: PropertyKey]: {
      entity: string;
      idKey: PropertyKey;
      field: PropertyKey;
    }[];
  };
}

export class FetchRegistry {
  registry: Registry = {};
  registerFetchField(config: RegisterConfig) {
    if (!this.registry[config.target.entity]) {
      this.registry[config.target.entity] = {};
    }
    if (!this.registry[config.target.entity][config.target.field]) {
      this.registry[config.target.entity][config.target.field] = [];
    }

    this.registry[config.target.entity][config.target.field].push({
      entity: config.source.entity,
      idKey: config.target.idKey,
      field: config.source.field,
    });
  }
  findInRegistry(entityId: string): Registry[string] | undefined {
    return this.registry[entityId];
  }
}
