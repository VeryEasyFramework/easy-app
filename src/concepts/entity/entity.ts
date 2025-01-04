import { EntityType } from "#/concepts/entity/entityType.ts";

export class Entity {
  private static _entityType: EntityType;

  static set entityType(value: EntityType) {
    this._entityType = value;
  }

  static get entityType(): EntityType {
    return this._entityType;
  }
  id: string;
  constructor() {
    this.id = "1234";
  }
}
