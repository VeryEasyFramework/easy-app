export interface Test {
/**
 * **Tag** (ListField)
 * @description A list of tags
 * @type {string[]}
 */
tag?: string[];
/**
 * **Status** (ChoicesField)
 * @type {string | number}
 * @required true
 */
status: string | number;
}