import type { EntityType } from "#/concepts/entityType.ts";

export interface ExchangeTypeConfig {
  /**
   * The description of the exchange type
   */
  description?: string;
  /**
   * The entity type that the exchange originates from
   */
  fromType: EntityType;
  /**
   * The entity type that the exchange is going to
   */
  toType: EntityType;
}
