import type { ExchangeTypeConfig } from "#/concepts/exchange/types.ts";
import type { EntityType } from "#/concepts/entity/entityType.ts";

/**
 * An `Exchange` is a record of an exchange of value or information between two or
 * more `Entities`.
 */
export class ExchangeType {
  name: string;

  fromType: EntityType;
  toType: EntityType;

  constructor(name: string, config: ExchangeTypeConfig) {
    this.name = name;
    this.fromType = config.fromType;
    this.toType = config.toType;
  }
}
