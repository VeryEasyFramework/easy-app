import type { EntityType } from "#/concepts/entity/entityType.ts";
import { PropertyType } from "#/concepts/property.ts";

export class AccountType {
  accountName: string;
  memberType: EntityType["entityName"];

  description?: string;
  propertyGroups: Array<StatePropertyGroupConfig> = [];
  /**
   * An `Account` is the central element in the system.
   *
   * It represents a consolidation or grouping of all the activity related to entities that interact with the organization.
   *
   * **Examples:** Customer, Vendor, Patient, Household, Employee, Student, Member, Subscriber, User, Client, Donor etc.
   *
   * An account is always owned by a single **`Entity`**.
   *
   * An account can have `Members`. An `Account Member` is an `Entity` that has a
   * relationship with the `Account` in some way such as an employee of a company.
   * An `Account Member` can perform `Actions` on behalf of the `Account`.
   *
   * An account member can either be an **`Entity`** or an **`Account`**.
   * @param {string} accountName The name of the account type
   * @param {AccountTypeConfig } options The configuration options for the account type
   */
  constructor(accountName: string, options: AccountTypeConfig) {
    this.accountName = accountName;
    this.description = options.description;
    this.memberType = options.memberType.entityName;
    this.propertyGroups = options.propertyGroups || [];
  }
}

/**
 * AccountTypeConfig
 *
 * The configuration options for an account type
 */

type AccountTypeConfig = {
  /**
   * The description of the account type
   */
  description?: string;
  /**
   * The entity type that owns the account
   */
  memberType: EntityType;

  loginNameProperty: string;

  /**
   * The state properties of the account, organized into groups
   */
  propertyGroups?: Array<StatePropertyGroupConfig>;
};

/**
 * StatePropertyConfig
 *
 * The configuration options for a state property
 */

interface StatePropertyConfig {
  /**
   * The name of the state property. This will be converted to camelCase and used as the property key,
   * and if the displayName is not set, `name` will be formatted as Title Case for display.
   */
  name: string;

  /**
   * The display name of the state property.
   * If not provided, the name will be converted to Title Case and used as the display name.
   */
  displayName?: string;
  /**
   * The type of the state property
   */
  propertyType: PropertyType;
  /**
   * The description of the state property
   */
  description?: string;
  /**
   * The default value of the state property
   */
  defaultValue?: any;
}

interface StatePropertyGroupConfig {
  groupName: string;
  displayName?: string;
  description?: string;
  properties: Array<StatePropertyConfig>;
}
