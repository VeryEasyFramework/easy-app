import { easyLog } from "#/log/logging.ts";
import type { EasyAppConfig } from "#/appConfig/appConfigTypes.ts";
import { setConfigEnv } from "#/appConfig/configEnv.ts";
import type { DBType } from "#orm/database/database.ts";

const configDefault: EasyAppConfig<"postgres"> = {
  appName: "Easy App",
  singlePageApp: true,
  staticFilesOptions: {
    staticFilesRoot: "./public",
    cache: true,
  },
  environment: "development",
  realtimeOptions: {
    enable: true,
    port: 11254,
  },
  multiProcessing: {
    enable: false,
    processCount: "auto",
  },
  workers: {
    short: {
      port: 12700,
    },
    medium: {
      port: 12701,
    },
    long: {
      port: 12702,
    },
  },
  easyPacks: ["authPack", "emailPack", "workersPack"],
  serverOptions: {
    hostname: "127.0.0.1",
    port: 8000,
  },
  ormOptions: {
    databaseType: "postgres",
    databaseConfig: {
      size: 1,
      clientOptions: {
        user: "postgres",
        password: "postgres",
        database: "postgres",
        host: "127.0.0.1",
        port: 5432,
      },
    },
  },
};

const optionalDefault: Partial<EasyAppConfig<"postgres">> = {
  appRootPath: ".",
  pathPrefix: "",
};

export async function initAppConfig(): Promise<
  Required<EasyAppConfig<DBType>>
> {
  try {
    const configString = await Deno.readTextFile("./appConfig.json");
    const config = JSON.parse(configString);
    const fullConfig = {
      ...optionalDefault,
      ...configDefault,
      ...config,
    };
    setConfigEnv(fullConfig);
    return fullConfig;
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
    const configJson = {
      $schema: "https://veryeasyframework.com/easyAppConfigSchema.json",
      ...configDefault,
    };
    await Deno.writeTextFile(
      "./appConfig.json",
      JSON.stringify(configJson, null, 2),
    );

    prompt("Press Enter to continue...");
    Deno.exit(1);
  }
}
