import { AccountType } from "#/concepts/account/accountType.ts";
import { personEntity } from "#/core/entities/person/person.ts";

const customerType = new AccountType("Customer", {
  description: "An account representing a customer",
  memberType: personEntity,
  loginNameProperty: "primaryEmail",
  propertyGroups: [{
    groupName: "Primary Information",
    properties: [],
  }],
});
