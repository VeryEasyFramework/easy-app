/**
 * Entity
 * An independently existing thing that has the ability to take action and affect the state of reality
 * **Examples:** `Person`, `Company`
 */

import type { PropertyType } from "#/concepts/property.ts";

export class EntityType {
  entityName: string;
  description: string;
  titleProperty: string;
  propertyGroups: Array<EntityPropertyGroupConfig> = [];

  constructor(entityName: string, config: EntityTypeConfig) {
    this.entityName = entityName;
    this.description = config.description || "";
    this.propertyGroups = config.propertyGroups || [];
    this.titleProperty = config.titleProperty || "id";
  }
}

type EntityTypeConfig = {
  /**
   * The description of the entity type
   */
  description?: string;
  /**
   * The state properties of the entity, organized into groups
   */
  propertyGroups?: Array<EntityPropertyGroupConfig>;

  titleProperty?: string;
};

/**
 * EntityPropertyGroupConfig
 */

interface EntityPropertyGroupConfig {
  /**
   * The name of the entity property group
   */
  groupName: string;
  /**
   * The display name of the entity property group
   */
  displayName?: string;
  /**
   * The description of the entity property group
   */
  description?: string;
  /**
   * The properties of the entity property group
   */
  properties: Array<EntityPropertyConfig>;
}

/**
 * EntityPropertyConfig
 */

interface EntityPropertyConfig {
  /**
   * The name of the entity property. This will be converted to camelCase and used as the property key,
   * and if the displayName is not set, `name` will be formatted as Title Case for display.
   */
  name: string;
  /**
   * The display name of the entity property.
   * If not provided, the name will be converted to Title Case and used as the display name.
   */
  displayName?: string;
  /**
   * The type of the entity property
   */
  propertyType: PropertyType;

  mandatory?: boolean;
  autoValue?: AutoValueConfig;
}

type AutoCombined = {
  type: "combinedProperties";
  properties: Array<string>;
};

type AutoComputed = {
  type: "computed";
  computeFunction: (entity: any) => any;
};
type AutoValueConfig = AutoCombined;
