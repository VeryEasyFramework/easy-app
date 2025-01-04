import { EasyApp } from "../mod.ts";
import { EasyOrm } from "#orm/orm.ts";
import { Database, DatabaseConfig } from "#orm/database/database.ts";

interface VefGlobal {
  running: boolean;
  app: EasyApp | null;
  orm?: EasyOrm;
  database?: Database<keyof DatabaseConfig>;
}
interface VefGlobalWithApp {
  running: boolean;
  app: EasyApp;
  orm: EasyOrm;
  database: Database<keyof DatabaseConfig>;
}

const vef: VefGlobal = {
  running: false,
  app: null as EasyApp | null,
};

function ensureVef(
  vef: VefGlobal,
): asserts vef is VefGlobalWithApp {
  if (vef.app === null) {
    throw new Error("VEF app does not exist");
  }
}

function ensureNoVef() {
  if (vef.app !== null) {
    throw new Error("VEF app already exists");
  }
}
function setVefValue<K extends keyof VefGlobal>(
  key: K,
  value: VefGlobal[K],
) {
  vef[key] = value;
}
function getVefValue<K extends keyof VefGlobal>(
  key: K,
): VefGlobalWithApp[K] {
  ensureVef(vef);
  return vef[key];
}

/**
 * Very Easy Framework
 *
 * This is the main wrapper for accessing the Very Easy Framework (VEF).
 */
export class VEF {
  private constructor() {
    // This class should not be instantiated since it is a static class so it should throw an error if it is instantiated

    throw new Error("VEF class should not be instantiated");
  }

  /**
   * Create a new VEF application
   * @param appName The name of the application
   * @returns {EasyApp} The new VEF application instance
   * @memberof VEF
   * @throws {Error} if the VEF application already exists
   * @example
   * ```ts
   * const app = VEF.createApp("MyApp");
   * ```
   */
  static createApp(appName?: string): EasyApp {
    ensureNoVef();
    const app = new EasyApp(appName);
    vef.app = app;
    vef.orm = app.orm;
    vef.database = app.orm.database;
    return app;
  }

  /**
   * Get the VEF application instance
   * @throws {Error} if the VEF application has not been created
   * @returns {EasyApp} The VEF application instance
   * @memberof VEF
   */
  static get app(): EasyApp {
    ensureVef(vef);
    return vef.app;
  }

  /**
   * Get the ORM instance
   */
  static get orm(): EasyOrm {
    ensureVef(vef);
    return vef.orm;
  }

  /**
   * Get the database instance
   */
  static get database(): Database<keyof DatabaseConfig> {
    ensureVef(vef);
    return vef.database;
  }
  /**
   * Run the VEF application
   */
  static run() {
    setVefValue("running", true);
    ensureVef(vef);
    getVefValue("app").run();
  }
}
