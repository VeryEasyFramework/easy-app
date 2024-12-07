import { formatValue } from "#orm/database/adapter/adapters/pgAdapter.ts";
import type { EasyOrm } from "#orm/orm.ts";

export class GlobalSearch {
  private orm: EasyOrm;
  private get database() {
    return this.orm.database;
  }
  constructor(orm: EasyOrm) {
    this.orm = orm;
  }

  async search(searchTerm: string) {
    const words = searchTerm.split(" ");
    const where = words.map((word) => {
      return `value ILIKE '%${word.trim()}%'`;
    }).join(" AND ");

    const results = await this.database.adapter.query(
      `SELECT * FROM easy_search_index WHERE ${where}`,
    );

    return results;
  }

  async indexEntryFields(
    entryType: string,
    entryId: string | number,
    fields: Record<string, string>,
  ) {
    const fieldKeys = Object.keys(fields);
    for (const fieldKey of fieldKeys) {
      await this.indexEntryField(
        entryType,
        entryId,
        fieldKey,
        fields[fieldKey],
      );
    }
  }
  async indexEntryField(
    entryType: string,
    entryId: string | number,
    field: string,
    text: string,
  ) {
    if (!text) {
      return await this.clearFieldIndex(entryType, entryId, field);
    }

    const exists = await this.hasIndex(entryType, entryId, field);
    if (exists) {
      await this.updateFieldIndex(entryType, entryId, field, text);
      return;
    }
    entryType = formatValue(entryType) as string;
    entryId = formatValue(entryId) as string | number;
    field = formatValue(field) as string;
    text = formatValue(text) as string;

    const query =
      `INSERT INTO easy_search_index (entry_type, entry_id, field, value) VALUES (${entryType}, ${entryId}, ${field}, ${text})`;
    const result = await this.database.adapter.query(query);
    return result;
  }

  async clearEntryIndex(entryType: string, entryId: string | number) {
    entryType = formatValue(entryType) as string;
    entryId = formatValue(entryId) as string;
    const query =
      `DELETE FROM easy_search_index WHERE entry_type = ${entryType} AND entry_id = ${entryId}`;
    const result = await this.database.adapter.query(query);
    return result;
  }

  async clearFieldIndex(
    entryType: string,
    entryId: string | number,
    field: string,
  ) {
    entryType = formatValue(entryType) as string;
    entryId = formatValue(entryId) as string;
    field = formatValue(field) as string;
    const query =
      `DELETE FROM easy_search_index WHERE entry_type = ${entryType} AND entry_id = ${entryId} AND field = ${field}`;
    const result = await this.database.adapter.query(query);
    return result;
  }

  async updateEntryIndex(
    entryType: string,
    entryId: string | number,
    fields: Record<string, string>,
  ) {
    await this.clearEntryIndex(entryType, entryId);
    await this.indexEntryFields(entryType, entryId, fields);
  }
  async hasIndex(entryType: string, entryId: string | number, field: string) {
    entryType = formatValue(entryType) as string;
    entryId = formatValue(entryId) as string;
    field = formatValue(field) as string;
    const results = await this.database.count("easySearchIndex", {
      filter: {
        entryType,
        entryId,
        field,
      },
    });
    return results > 0;
  }

  async updateFieldIndex(
    entryType: string,
    entryId: string | number,
    field: string,
    text: string,
  ) {
    entryType = formatValue(entryType) as string;
    entryId = formatValue(entryId) as string;
    field = formatValue(field) as string;
    text = formatValue(text) as string;
    const query =
      `UPDATE easy_search_index SET value = ${text} WHERE entry_type = ${entryType} AND entry_id = ${entryId} AND field = ${field}`;
    const result = await this.database.adapter.query(query);
    return result;
  }
  async createSearchIndex() {
    await this.database.adapter.query(
      `CREATE INDEX easy_search_index_value ON easy_search_index USING gin(value)`,
    );
  }

  async dropSearchIndex() {
    await this.database.adapter.query(
      `DROP INDEX easy_search_index_value`,
    );
  }

  async clearSearchIndex() {
    await this.database.adapter.query(
      `DELETE FROM easy_search_index`,
    );
  }

  async dropSearchTable() {
    await this.database.adapter.query(
      `DROP TABLE easy_search_index`,
    );
  }

  async createSearchTable() {
    await this.database.adapter.query(
      `CREATE TABLE easy_search_index (
        entry_type TEXT,
        entry_id TEXT,
        field TEXT,
        value TEXT
      )`,
    );
  }

  async validateSearchTable() {
    const exists = await this.database.adapter.tableExists("easy_search_index");
    if (!exists) {
      await this.createSearchTable();
    }
  }

  async rebuildIndex() {
    await this.clearSearchIndex();
    const entries = this.orm.entryTypes.values();
    const searchableEntries = entries.filter((entry) =>
      entry.config.globalSearch
    );
    for (const entryType of searchableEntries) {
      const fields = entryType.fields.filter((field) => field.inGlobalSearch);
      const entries = await this.orm.getEntryList(entryType.entryType, {
        columns: ["id", ...fields.map((field) => field.key)],
      });
      for (const entry of entries.data) {
        const searchValues: Record<string, string> = {};
        for (const field of fields) {
          searchValues[field.key] = entry[field.key] as string;
        }
        await this.updateEntryIndex(
          entryType.entryType,
          entry.id,
          searchValues,
        );
      }
    }
  }
}
