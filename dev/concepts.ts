import { AccountType } from "#/concepts/account/accountType.ts";
import { EntityType } from "#/concepts/entity/entityType.ts";

const personType = new EntityType("Person");

const customerType = new AccountType("Customer", {
  description: "An account representing a customer",
  ownerType: personType,
});
