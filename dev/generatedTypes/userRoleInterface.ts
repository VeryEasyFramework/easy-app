export interface UserRole {
  /**
   * **Role Name** (DataField)
   * @description The name of the role
   * @type {string}
   * @required true
   */
  roleName: string;
  /**
   * **Role Key** (DataField)
   * @description A unique key for the role
   * @type {string}
   */
  roleKey?: string;
  /**
   * **Description** (DataField)
   * @description A description of the role
   * @type {string}
   */
  description?: string;
}
