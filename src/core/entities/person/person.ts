import { EntityType } from "#/concepts/entity/entityType.ts";

export const personEntity = new EntityType("Person", {
  description: "A person",
  propertyGroups: [{
    groupName: "Primary Information",
    properties: [{
      name: "firstName",
      mandatory: true,
      propertyType: {
        type: "Text",
        length: "short",
      },
    }, {
      name: "lastName",
      propertyType: {
        type: "Text",
        length: "short",
      },
    }, {
      name: "primaryEmail",
      propertyType: {
        type: "Email",
      },
    }],
  }],
});
