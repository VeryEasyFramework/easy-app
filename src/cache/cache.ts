import type { SafeType } from "@vef/types";

export class EasyCache {
  cache: Storage;
  constructor() {
    this.cache = sessionStorage;
  }

  set(table: string, id: string, value: SafeType): void {
    const key = `${table}:${id}`;
    this.cache.setItem(key, JSON.stringify({ value }));
  }

  get(table: string, id: string): SafeType | undefined {
    const key = `${table}:${id}`;
    const response = this.cache.getItem(key);
    if (!response) return;
    const { value } = JSON.parse(response);
    return value;
  }
  delete(table: string, id: string): void {
    const key = `${table}:${id}`;
    this.cache.removeItem(key);
  }

  clear() {
    this.cache.clear();
  }

  appendList(table: string, values: { id: string; value: SafeType }[]): void {
    values.forEach(({ id, value }) => {
      this.set(table, id, value);
    });
  }

  setList(table: string, values: { id: string; value: SafeType }[]): void {
    this.deleteList(table);
    this.appendList(table, values);
  }

  getList(table: string): Array<{ id: string; value: SafeType }> {
    const keys = Object.keys(this.cache);
    const values: Array<{ id: string; value: SafeType }> = [];
    keys.forEach((key) => {
      const [tableId, id] = key.split(":");
      if (tableId === table) {
        const value = this.get(table, id);
        if (value) {
          values.push({ id, value });
        }
      }
    });
    return values;
  }

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
