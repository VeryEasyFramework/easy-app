import { EasyFieldType } from "@vef/types";
import { fieldTypeMap } from "#orm/entry/field/fieldTypeMap.ts";
import { EntityType } from "#/concepts/entity/entityType.ts";
import { AccountType } from "#/concepts/account/accountType.ts";
export type Decimal = {
  type: "DecimalNumber";
  precision: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  minimum?: number;
  maximum?: number;
};

export type Integer = {
  type: "WholeNumber";
  minimum?: number;
  maximum?: number;
};

/**
 *  Text
 */
export type Text = {
  /**
   * The type of the property
   */
  type: "Text";

  /**
   * The length of the text
   *
   * `short` - 255 characters
   * `medium` - 1027 characters
   * `long` - 60,000 characters
   *
   * Or a specific number of characters
   */

  length: keyof TextLength | number;
};

interface TextLength {
  short: 255;
  medium: 1027;
  long: 60000;
}
export type Choice = {
  type: "Choice";
  choiceList: string[];
};

export type Date = {
  type: "Date";
  withTime?: boolean;
};

export type Time = {
  type: "Time";
  withDate?: boolean;
};

export type Currency = {
  type: "Currency";
  code: string;
  symbol: string;
  precision?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

export type TrueFalse = {
  type: "TrueFalse";
  format?: "checkbox" | "switch" | "withText";
  trueValue?: string;
  falseValue?: string;
};

export type Email = {
  type: "Email";
};

export type Phone = {
  type: "Phone";
};

export type WebLink = {
  type: "WebLink";
};

export type Reference = {
  type: "Reference";
  referenceTo: EntityType | AccountType;
};

export type PropertyType =
  | Decimal
  | Integer
  | Text
  | Choice
  | Date
  | Time
  | Currency
  | TrueFalse
  | Email
  | Phone
  | WebLink;

interface PropertyGroupConfig {
  name: string;
  displayName?: string;
  description?: string;
  properties: Array<PropertyType>;
}
