import type { SafeType } from "@vef/easy-orm";

export class EasyCache {
   cache: Storage;
   constructor() {
      this.cache = sessionStorage;
   }

   set(table: string, id: string, value: SafeType) {
      const key = `${table}:${id}`;
      this.cache.setItem(key, JSON.stringify({ value }));
   }

   get(table: string, id: string) {
      const key = `${table}:${id}`;
      const response = this.cache.getItem(key);
      if (!response) return null;
      const { value } = JSON.parse(response);
      return value;
   }
   delete(table: string, id: string) {
      const key = `${table}:${id}`;
      this.cache.removeItem(key);
   }

   clear() {
      this.cache.clear();
   }

   appendList(table: string, values: { id: string; value: SafeType }[]) {
      values.forEach(({ id, value }) => {
         this.set(table, id, value);
      });
   }

   setList(table: string, values: { id: string; value: SafeType }[]) {
      this.deleteList(table);
      this.appendList(table, values);
   }

   getList(table: string) {
      const keys = Object.keys(this.cache);
      return keys.map((key) => {
         const [tableId, id] = key.split(":");
         if (tableId === table) {
            return { id, value: this.get(table, id) };
         }
      });
   }

   deleteList(table: string) {
      const keys = Object.keys(this.cache);
      keys.forEach((key) => {
         const [tableId, id] = key.split(":");
         if (tableId === table) {
            this.delete(table, id);
         }
      });
   }
}
