/**
 * This module contains the common types and interfaces used in the Very Easy Framework.
 * It is externalized as a separate module to allow for shared usage across
 * both server and client code.
 * @module
 */

export interface DocsActionParam {
  paramName: string;
  required: boolean;
  type: EasyFieldType;
}
export interface DocsAction {
  actionName: string;
  description: string;
  params: Array<DocsActionParam>;
  response?: string;
  public?: boolean;
  system?: boolean;
}

export interface DocsActionGroup {
  groupName: string;
  actions: Array<DocsAction>;
}

export interface ChildListConfig {
  tableName: string;
}

/**
 * Represents a child list definition.
 */
export interface ChildListDefinition {
  childName: string;
  readOnly?: boolean;
  label: string;
  fields: EasyField[];
  config?: ChildListConfig;
}

type DependsOn =
  | string
  | {
    field: string;
    value: any;
  }
  | Array<{
    field: string;
    value: any;
  }>;
/**
 * The choice definition for a field that's set to `ChoicesField` or `MultiChoiceField`.
 */
export interface Choice<K extends PropertyKey = string> {
  /**
   * The key of the choice. This is the value that will be stored in the field.
   */
  key: K;
  /**
   * A human-readable label for the choice.
   */
  label: string;
  /**
   * The color of the choice. This is how the choice will be displayed in the UI.
   */
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "muted";

  /**
   * A human-readable description for the choice.
   */

  description?: string;
}

/**
 * The connected entry type for a field that's set to `ConnectionField`.
 */

export interface FetchOptions {
  /**
   * The entry type to fetch from
   */
  fetchEntryType: string;
  /**
   * The field key in `this` entry that contains the id of the entry of the entry type to fetch from
   */
  thisIdKey: string;

  /**
   * The field key in `this` entry that will get the value of the fetched entry
   */
  thisFieldKey: string;
  /**
   * The field key of the fetched record that contains the value to fetch
   */
  thatFieldKey: string; // foreign field key
}

/**
 * The field definition for a field in an entry type.
 */
export interface EasyField<
  K extends string = string,
  P extends PropertyKey = PropertyKey,
  C extends Choice<P>[] = Choice<P>[],
> {
  /**
   * The key of the field. This is how the field will be accessed in the entry.
   */
  key: K;

  /**
   * The label of the field. This is how the field will be displayed in the UI.
   */
  label?: string;

  /**
   * The description of the field. This is how the field will be described in the UI.
   */
  description?: string;

  /**
   * Whether the field is required.
   */
  required?: boolean;
  /**
   * Set to true if the field should be read-only and not editable by the user.
   */
  readOnly?: boolean;
  /**
   * The type of the field.
   *
   * **DataField**: Short text data. Limited to 255 characters.
   *
   * **IntField**: Integer.
   *
   * **BigIntField**: BigInt.
   *
   * **DecimalField**: Decimal.
   *
   * **DateField**: Date.
   *
   * **TimestampField**: Date and time.
   *
   * **BooleanField**: Boolean.
   *
   * **ChoicesField**: Single choice.
   *
   * **MultiChoiceField**: Multiple choices.
   *
   * **TextField**: Long text data.
   *
   * **EmailField**: Email.
   *
   * **ImageField**: Image URL.
   *
   * **JSONField**: JSON object.
   *
   * **PhoneField**: Phone number.
   *
   * **ConnectionField**: Connection to another entry.
   *
   * **PasswordField**: Password.
   *
   * **IDField**: ID.
   *
   * **RichTextField**: Rich text data.
   *
   * **URLField**: URL.
   *
   * **ListField**: List of words or phrases.
   */
  fieldType: EasyFieldType;

  /**
   * Set to true if the field is the primary key of the entry type.
   */
  primaryKey?: boolean;

  /**
   * The fetch options for the field. Only applicable for ConnectionField.
   */
  fetchOptions?: FetchOptions;

  /**
   * Set to true if the field should be included in the default list view.
   */
  inList?: boolean;

  inConnectionList?: boolean;

  /**
   * The choices for the field. Only applicable for ChoicesField and MultiChoiceField.
   */
  choices?: C;

  choicesFilter?: string | number | AdvancedFilter;

  currency?: {
    code: string;
    symbol: string;
  };

  /**
   * The number style for the field. Only applicable for DecimalField and IntField.
   */
  numberStyle?: "percent";
  /**
   * The default value of the field. Can be a value or a function that returns a value.
   */
  defaultValue?:
    | EasyFieldTypeMap[EasyFieldType]
    | (() => EasyFieldTypeMap[EasyFieldType]);

  connectionEntryType?: string;

  connectionIdType?: EasyFieldType;

  connectionTitleField?: string;

  /**
   * Hide the connection from the connected entryType. Default is false.
   */
  hideConnection?: boolean;

  connectionFilter?: {
    [key: string]: AdvancedFilter | SafeType;
  };

  /**
   * Set to true if the field should be unique.
   */
  unique?: boolean;

  /**
   * Set to true if the field should be hidden in the UI.
   */
  hidden?: boolean;

  /**
   * The group that the field belongs to.
   */
  group?: string;

  inCreate?: boolean;

  quickCreate?: boolean;

  showTime?: boolean;

  dependsOn?: DependsOn;
  fetchOnCreate?: {
    idKey: string;
    field: string;
  };

  /**
   * Custom properties for the field.
   */
  custom?: Record<string, any>;
}

/**
 * The field types that are available in Easy ORM.
 */
export interface EasyFieldTypeMap {
  /**
   * The ID field type.
   */
  IDField: string;

  /**
   * The data field type. This is a short text data field that is limited to 255 characters.
   */
  DataField: string;

  /**
   * The integer field type. This is a field that stores an integer.
   */
  IntField: number;

  /**
   * The big integer field type. This is a field that stores a big integer.
   */
  BigIntField: bigint;

  /**
   * The decimal field type. This is a field that stores a decimal number.
   */
  DecimalField: number;

  /**
   * The date field type. This is a field that stores a date without a time.
   * 'YYYY-MM-DD'
   */
  DateField: string;

  /**
   * The timestamp field type. This is a field that stores a date and time.
   * it's a number that represents the number of milliseconds since the Unix epoch.
   *
   * **Note**: This is a number, not a Date object.
   *
   * `new Date(timestampField)` will convert the number to a Date object.
   */
  TimeStampField: number;

  /**
   * The boolean field type. This is a field that stores a boolean value
   * `true` or `false`.
   */
  BooleanField: boolean;

  /**
   * The password field type. This is a field that stores a password.
   * It's main difference from the DataField is in how it's shown in the UI.
   */
  PasswordField: string;

  /**
   * The Choices field type. This is a field that stores a single choice.
   * The choices are defined in the `choices` property of the field definition.
   * The value of the field is the key of the selected choice.
   */
  ChoicesField: string | number;

  /**
   * The MultiChoice field type. This is a field that stores multiple choices.
   * The choices are defined in the `choices` property of the field definition.
   * The value of the field is an array of the keys of the selected choices.
   */
  MultiChoiceField: string[];

  /**
   * The text field type. This is a long text data field.
   */
  TextField: string;

  /**
   * The email field type. This is a field that stores an email address.
   * The value is validated to be a valid email address format.
   */
  EmailField: string;

  /**
   * This is not implemented yet!
   */
  ImageField: string;

  /**
   * The JSON field type. This is a field that stores a JSON object.
   */
  JSONField: Record<string, any>;

  /**
   * The phone field type. This is a field that stores a phone number.
   * The value is validated to be a valid phone number format.
   */
  PhoneField: string;

  /**
   * This is a connection field type.
   * This is a field that references an entry from another entry type,
   */
  ConnectionField: string;

  /**
   * Not implemented yet!
   */
  RichTextField: Record<string, any>;

  /**
   * The URL field type. This is a field that stores a URL.
   * The value is validated to be a valid URL format.
   */
  URLField: string;

  /**
   * The tag field type. This is a field that stores a list of words or phrases.
   *
   * **Example**: `["tag1", "tag2", "tag3"]`
   */
  ListField: string[];

  CurrencyField: number;
}

export type EasyFieldType = keyof EasyFieldTypeMap;

export type SafeType = EasyFieldTypeMap[EasyFieldType] | null;

export type SafeReturnType = Promise<SafeType | void> | SafeType | void;

export interface FieldGroupDefinition {
  key: string;
  title: string;
  description?: string;
  dependsOn?: DependsOn;
}

export interface FieldGroup {
  key: string;
  title: string;
  description?: string;
  dependsOn?: DependsOn;
  fields: Array<EasyField>;
}

export interface ListOptions {
  columns?: string[] | "*";
  filter?: Record<string, string | number | AdvancedFilter>;
  orFilter?: Record<string, string | number | AdvancedFilter>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  withTotals?: string[];
}

export interface DatabaseListOptions {
  columns?:
    | Array<
      string | {
        key: string;
        entryType: string;
        type: "multiChoice";
      }
    >
    | "*";
  filter?: Record<string, string | number | AdvancedFilter>;
  orFilter?: Record<string, string | number | AdvancedFilter>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  withTotals?: string[];
}

export interface AdvancedFilter {
  op:
    | "contains"
    | "notContains"
    | "inList"
    | "notInList"
    | "between"
    | "notBetween"
    | "is"
    | "isNot"
    | "isEmpty"
    | "isNotEmpty"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan"
    | "greaterThanOrEqual"
    | "lessThanOrEqual"
    | "equal"
    | ">"
    | "<"
    | ">="
    | "<="
    | "="
    | "!=";
  value: any;
}

export interface RowsResult<T> {
  rowCount: number;
  totalCount: number;
  data: T[];
  columns: string[];
  totals?: Record<string, number>;
}

/**
 * This interface represents a log of an edit action on a record.
 */
export interface EditLog extends Entry {
  entryType: string;
  entryId: string;
  entryTitle: string;
  user: string;
  userFullName: string;
  action: "create" | "update" | "delete";
  editData: Record<string, any>;
}

export interface EntryConnectionCount {
  entryType: string;
  label: string;
  count: number;
  fieldKey: string;
  fieldLabel: string;
}
export interface EntryInfo {
  editLog: EditLog[];
  connections: EntryConnectionCount[];
  comments: any[];
}

/**
 * Represents a single Entry record in the database.
 */
export interface Entry {
  /**
   * The unique identifier for this record.
   */
  id: string;
  /**
   * The date and time this record was created.
   */
  createdAt: number;

  /**
   * The date and time this record was last updated.
   */
  updatedAt: number;

  [key: string]: any;
}
interface IdMethod {
  type: "number" | "uuid" | "hash" | "series" | "data" | "field";
}

interface NumberMethod extends IdMethod {
  type: "number";
  autoIncrement: boolean;
}

interface UuidMethod extends IdMethod {
  type: "uuid";
}

interface HashMethod extends IdMethod {
  type: "hash";
  hashLength: number;
}

interface SeriesMethod extends IdMethod {
  type: "series";
}

interface DataMethod extends IdMethod {
  type: "data";
}

export interface FieldMethod extends IdMethod {
  type: "field";
  field: string;
}

/**
 * Represents the method used to generate unique identifiers for entry types.
 */
export type IdMethodType =
  | NumberMethod
  | UuidMethod
  | HashMethod
  | DataMethod
  | SeriesMethod
  | FieldMethod;

/**
 * The configuration for an Entry.
 */
export interface EntryTypeConfig<FieldKeys = string> {
  /**
   * The human-readable label for this Entry.
   */
  label: string;
  /**
   * A Brief description of this Entry.
   */
  description: string;
  /**
   * The field to use as the title for this Entry in the UI instead of the ID.
   * If not provided, the Entry's ID will be used.
   */
  titleField?: FieldKeys;

  /**
   * The field to use as the status for this Entry in the UI.
   * This field should be a Choices field.
   */
  statusField?: string;

  searchFields?: Array<{ key: string; label: string }>;

  /**
   * The name of the table in the database where this Entry is stored.
   * This defaults to the snake_case version of the Entry's name.
   */
  tableName: string;

  /**
   * If true, this Entry has an edit log that tracks changes to records.
   * This defaults to false.
   *
   * By default, the edit log will track create and delete actions but not updates.
   */
  editLog?: boolean;

  /**
   * The method used to generate unique identifiers for this Entry.
   * If not provided, the Entry will use the `HashMethod` with a hash length of 16.
   */
  idMethod:
    | NumberMethod
    | UuidMethod
    | HashMethod
    | SeriesMethod
    | DataMethod
    | FieldMethod;

  /**
   * The field to use for the order of records when fetching a list of records from the database.
   */
  orderField?: string;

  /**
   * The direction to order records when fetching a list of records from the database.
   * This defaults to "asc".
   */
  orderDirection?: "asc" | "desc";
}

/**
 * This is the configuration for an Entry.
 */
export interface EntryType {
  /**
   * The identifier of the Entry.
   * For example, `user` or `product`.
   */
  entryType: string;

  /**
   * The fields that make up this Entry.
   */
  fields: Array<EasyField>;

  /**
   * The children lists that belong to this Entry.
   */
  children: Array<ChildListDefinition>;

  /**
   * The field to use as the status for this Entry in the UI.
   * This field should be a Choices field.
   */

  statusField?: EasyField;

  /**
   * The same fields as `fields`, but grouped together based on their `group` property.
   * This is useful for rendering forms with sections or tabs in the UI.
   */
  fieldGroups: Array<FieldGroup>;

  displayFieldGroups: Array<FieldGroup>;
  /**
   * A list of field keys of fields that have `inList` set to `true`.
   * This is useful for passing to the `columns` property when fetching a list of records.
   */
  listFields: Array<string>;
  /**
   * The configuration object for this Entry.
   */
  config: EntryTypeConfig;
  /**
   * The lifecycle hooks for this Entry.
   * These hooks are called at various points in the lifecycle of an Entry record
   * such as before saving, after saving, before validating, etc.
   */
  hooks: EntryHooks;

  /**
   * The actions that can be performed on a record of this Entry.
   */
  actions: Array<EntryAction>;

  connections: Array<EntryConnection>;
}

export interface EntryConnection {
  entryType: string;
  label: string;
  idFieldKey: string;
  fieldLabel: string;

  listFields: Array<EasyField>;
}

export interface EntryAction {
  key: string;
  label?: string;
  description?: string;

  customValidation?: boolean;

  /**
   * If true, this action can only be called internally
   */
  private?: boolean;

  /**
   * If true, this action can be called without loading a specific Entry first
   */
  global?: boolean;
  action(
    entry: Entry,
    params: Record<string, any>,
  ): SafeReturnType;
  params?: Array<EasyField>;
}

export interface EntryHookDefinition {
  label?: string;
  description?: string;

  action(entry: Entry): Promise<void> | void;
}

export type EntryHook = keyof EntryHooks;
export interface EntryHooks {
  beforeSave: Array<EntryHookDefinition>;
  afterSave: Array<EntryHookDefinition>;
  beforeInsert: Array<EntryHookDefinition>;
  afterInsert: Array<EntryHookDefinition>;
  validate: Array<EntryHookDefinition>;
  beforeValidate: Array<EntryHookDefinition>;
  beforeDelete: Array<EntryHookDefinition>;
  afterDelete: Array<EntryHookDefinition>;
}

/**
 * This is the structure of the data returned by the `getEntryList` method.
 */
export interface GetListResult<T extends Entry = Entry> {
  /**
   * The number of records returned in this response.
   * This may be less than the total number of records in the database if the `limit` parameter was used.
   *
   * **Note:** The default limit is `100`.
   */
  rowCount: number;

  /**
   * The total number of records in the database that match the query.
   */
  totalCount: number;

  /**
   * The records that match the query.
   */
  data: T[];

  /**
   * The columns that are included in the response.
   */
  columns: string[];
}

export interface Settings {
  [key: string]: SafeType | null | undefined;
}
export interface SettingsTypeConfig {
  label: string;
  description: string;
  editLog?: boolean;
}
export interface SettingsTypeHookDefinition {
  label?: string;
  description?: string;
  action(settings: Settings): Promise<void> | void;
}

export type SettingsHooks = {
  beforeSave: Array<SettingsTypeHookDefinition>;
  afterSave: Array<SettingsTypeHookDefinition>;
  validate: Array<SettingsTypeHookDefinition>;
  beforeValidate: Array<SettingsTypeHookDefinition>;
};

export type SettingsHook = keyof SettingsHooks;
export interface SettingsAction {
  key: string;
  label: string;
  description: string;
  action(
    settingsRecord: Settings,
    params: Record<string, any>,
  ): Promise<void> | void;
  params: Array<EasyField>;
}
export interface SettingsType {
  settingsType: string;
  fields: Array<EasyField>;
  fieldGroups: Array<FieldGroup>;
  config: SettingsTypeConfig;
  children: Array<ChildListDefinition>;
  hooks: SettingsHooks;
  actions: Array<SettingsAction>;
}

/**
 * The user session of the current authenticated user
 */
export interface UserSession {
  /**
   * The session ID
   */
  sessionId: string;
  /**
   * The user ID of the `User` record stored in the database
   */
  userId: string;
  /**
   * The email address of the user used for authentication
   */
  email: string;
  /**
   * The full name of the user
   */
  userName: string;

  /**
   * Whether the user is a system administrator
   */
  systemAdmin: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}
