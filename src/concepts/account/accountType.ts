import type { EntityType } from "#/concepts/entity/entityType.ts";

export class AccountType {
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
   * @param {string} name The name of the account type
   * @param {AccountTypeConfig } options The configuration options for the account type
   */
  constructor(name: string, options: AccountTypeConfig) {}
}

/**
 * AccountTypeConfig
 *
 * The configuration options for an account type
 */

interface AccountTypeConfig {
  /**
   * The description of the account type
   */
  description?: string;
  /**
   * The entity type that owns the account
   */
  ownerType: EntityType;
}
