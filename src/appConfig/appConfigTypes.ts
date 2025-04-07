import type { DatabaseConfig, DBType } from "#orm/database/database.ts";
import type { StaticFilesOptions } from "#/staticFiles/staticFileHandler.ts";
import type { SMTPOptions } from "#/package/emailPack/smtp/smtpTypes.ts";
import type { EasyFieldType } from "#/vef-types/mod.ts";

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

  easyPacks?: Array<string>;

  /**
   * Options for running multiple instances of the app on separate threads. This controls the number of instances of the app
   * that will run in parallel to handle requests on the web server.
   *
   * *NOTE:* Only supported on Linux. It makes use of the `reusePort` functionality of the OS. This is not supported on Windows. It handles requests in a round-robin fashion.
   *
   * **`enable`** - Whether to enable multi-threading or not. Default: `false`
   * **`processCount`** - The number of instances of the app to run in parallel. `auto` will use the number of CPU cores available. Default: `auto`
   * **`max`** - The maximum number of workers to run. This is useful when you want to limit the number of workers that can run when using `auto` mode.
   * Note: This is separate from the workers that are used for background tasks, which are
   * each in their own process.
   */
  multiProcessing: {
    /**
     * Whether to enable multiprocessing or not.
     * @default false
     */
    enable: boolean;
    /**
     * The number of instances of the app to run in parallel.
     * `auto` will use the number of CPU cores available.
     * @default "auto"
     */
    processCount: "auto" | number;
    /**
     * The maximum number of instances of the app to run in parallel.
     */
    max?: number;
  };
  workers: {
    /**
     * Short workers are used for quick tasks that take less than 1 minute.
     */
    short: {
      /**
       * The port to run the short worker on.
       * @default 12700
       */
      port: number;
    };
    /**
     * Medium workers are used for tasks that take up to 5 minutes.
     */
    medium: {
      /**
       * The port to run the medium worker on.
       * @default 12701
       */
      port: number;
    };
    /**
     * Long workers are used for tasks that take up to 30 minutes.
     * This is the maximum time a worker should run.
     */
    long: {
      /**
       * The port to run the long worker on.
       * @default 12702
       */
      port: number;
    };
  };

  /**
   * The name of the app. This is used in the logs and other places where the app name is needed.
   */

  appName?: string;
  /**
   * The path prefix for the app. This is useful when the app is running behind a reverse proxy.
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
  serverOptions?: Deno.ServeTcpOptions & {
    hostname?: string;
    port?: number;
    reusePort?: boolean;
  };

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

  realtimeOptions?: {
    enable: boolean;
    port: number;
  };
}
