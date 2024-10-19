import type { SafeType } from "@vef/types";

/**
 * A simple cache that stores data in-memory for the current execution context.
 */

export class EasyCache {
  cache: Storage;
  constructor() {
    this.cache = sessionStorage;
  }

  /**
   * Set a value in the cache. If the value already exists, it will be overwritten.
   * @param table The table to store the value in
   * @param id The id of the value
   * @param value The value to store
   */
  set(table: string, id: string, value: SafeType): void {
    const key = `${table}:${id}`;
    this.cache.setItem(key, JSON.stringify({ value }));
  }

  /**
   * Get a value from the cache.
   * @param table  The table to get the value from
   * @param id  The id of the value
   * @returns The value, or undefined if it doesn't exist
   */
  get<T = SafeType>(table: string, id: string): T | undefined {
    const key = `${table}:${id}`;
    const response = this.cache.getItem(key);
    if (!response) return;
    const { value } = JSON.parse(response);
    return value;
  }

  /**
   * Delete a value from the cache.
   * @param table The table to delete the value from
   * @param id The id of the value
   */
  delete(table: string, id: string): void {
    const key = `${table}:${id}`;
    this.cache.removeItem(key);
  }

  /**
   * Clear the cache. Deletes all items in the cache!
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Add items to an existing list. If the list doesn't exist, it will create a new one.
   * @param table The table to store the list in
   * @param values The items to add to the list
   */
  appendList(table: string, values: { id: string; value: SafeType }[]): void {
    values.forEach(({ id, value }) => {
      this.set(table, id, value);
    });
  }

  /**
   * Replace an existing list with new items. Deletes all existing items in the list!
   * If there's no existing list, it will create a new one.
   * @param table The table to store the list in
   * @param values The items to add to the list
   */
  setList(table: string, values: { id: string; value: SafeType }[]): void {
    this.deleteList(table);
    this.appendList(table, values);
  }

  /**
   * Get all items in a list.
   * @param table The table to get the list from
   * @returns An array of items in the list
   */
  getList<T = SafeType>(table: string): Array<{ id: string; value: T }> {
    const keys = Object.keys(this.cache);
    const values: Array<{ id: string; value: T }> = [];
    keys.forEach((key) => {
      const [tableId, id] = key.split(":");
      if (tableId === table) {
        const value = this.get<T>(table, id);
        if (value) {
          values.push({ id, value });
        }
      }
    });
    return values;
  }

  /**
   * Delete all items in a list.
   * @param table The table to delete the list from
   */

  deleteList(table: string): void {
    const keys = Object.keys(this.cache);
    keys.forEach((key) => {
      const [tableId, id] = key.split(":");
      if (tableId === table) {
        this.delete(table, id);
      }
    });
  }
}
