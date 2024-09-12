import type { DatabaseConfig, DBType, EasyFieldType } from "@vef/easy-orm";
import type { StaticFilesOptions } from "#/staticFiles/staticFileHandler.ts";

export interface EasyAppConfig<D extends DBType> {
  /**
   * The root path of the app. Defaults to the current directory.
   * This is used to serve static files and to store the database file for
   * the ORM when using the default database type {json}.
   *
   * > **Note:** This path should be an absolute path.
   *
   * > **Note:** Use the forward slash `/` as the path separator even on Windows.
   *  The app will handle the path correctly.
   * ```ts
   * const app = new EasyApp({
   *  appRootPath: "/path/to/app/root",
   * });
   * ```
   */

  environment?: "development" | "production";
  appRootPath?: string;

  /**
   * The file name of the main module for the app.
   *
   * For example `main.ts` or `app.ts`
   */
  mainModule?: string;
  /**
   * The name of the app. This is used in the logs and other places where the app name is needed.
   */

  appName?: string;
  /**
   * The path prefix for the app. This is useful when the app is running behind a reverse proxy.
   *
   * **Example:**
   * ```ts
   * const app = new EasyApp({
   * pathPrefix: "/myapp",
   * });
   * ```
   */
  pathPrefix?: string;

  /**
   * Set to true if the app is a single page app (SPA)
   * that has a single entry point.
   *
   * This will serve the index.html file for all requests that are not files.
   */
  singlePageApp?: boolean;

  /**
   * Options for the static files handler
   *
   * **`cache`** - Whether to cache files or not. Default: `true`
   *
   * **`staticFilesRoot`** - The root directory of the static files.
   */
  staticFilesOptions?: StaticFilesOptions;

  /**
   * Options for the Deno server
   *
   * **`port`** - The port to run the server on. Default: `8000`
   *
   * **`hostname`** - The hostname to run the server on. Default: `
   */
  serverOptions?: Deno.ServeOptions;

  /**
   * Options for the ORM
   *
   * **`databaseType`** - The type of database to use. Default: `denoKv`
   *
   * **`databaseConfig`** - The configuration object for the database
   */
  ormOptions?: {
    databaseType: keyof DatabaseConfig;
    databaseConfig: DatabaseConfig[keyof DatabaseConfig];
    idFieldType?: EasyFieldType;
  };
}
