import type { EasyAppOptions } from "#/easyApp.ts";
import { easyLog } from "#/log/logging.ts";
import type { DBType } from "@vef/easy-orm";

const configDefault: EasyAppOptions<"postgres"> = {
  appName: "Easy App",
  singlePageApp: false,
  staticFilesOptions: {
    staticFilesRoot: "./public",
    cache: true,
  },
  serverOptions: {
    hostname: "localhost",
    port: 8000,
  },
  ormOptions: {
    databaseType: "postgres",
    databaseConfig: {
      camelCase: true,
      size: 1,
      clientOptions: {
        user: "postgres",
        password: "postgres",
        database: "postgres",
        host: "localhost",
        port: 5432,
      },
    },
  },
};

const optionalDefault: EasyAppOptions<"postgres"> = {
  appRootPath: ".",
  appName: "Easy App",
  singlePageApp: false,
  staticFilesOptions: {
    staticFilesRoot: "./public",
    cache: true,
  },
  serverOptions: {
    hostname: "localhost",
    port: 8000,
  },
  mainModule: "main.ts",
  pathPrefix: "",
  ormOptions: {
    databaseType: "postgres",
    databaseConfig: {
      camelCase: true,
      size: 1,
      clientOptions: {
        user: "postgres",
        password: "postgres",
        database: "postgres",
        host: "localhost",
        port: 5432,
      },
    },
  },
};

export async function initAppConfig(): Promise<
  Required<EasyAppOptions<DBType>>
> {
  try {
    const configString = await Deno.readTextFile("./appConfig.json");
    const config = JSON.parse(configString);
    return {
      ...optionalDefault,
      ...configDefault,
      ...config,
    };
  } catch (_e) {
    easyLog.warning(
      `No appConfig.json found. Creating one with default values at ./appConfig.json`,
      "appConfig.json",
      {
        hideTrace: true,
      },
    );
    easyLog.warning(
      `Please edit the file with your database configuration`,
      "appConfig.json",
      {
        hideTrace: true,
      },
    );
    await Deno.writeTextFile(
      "./appConfig.json",
      JSON.stringify(configDefault, null, 2),
    );

    prompt("Press Enter to continue...");
    Deno.exit(1);
  }
}
