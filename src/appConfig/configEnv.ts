import type { EasyAppConfig } from "#/appConfig/appConfigTypes.ts";

export function getEnv<E extends EnvKey, V extends EnvValueMap[E]>(
  key: E,
): V {
  const value = Deno.env.get(key);
  let envValue: any;
  switch (key) {
    case "VEF_SINGLE_PAGE_APP":
      envValue = value === "1" as V;
      break;

    case "VEF_ENVIRONMENT":
      envValue = value === "production" ? "production" : "development";
      break;

    case "VEF_APP_NAME":
      envValue = value || "Easy App";
      break;
    default:
      envValue = "";
  }
  return envValue;
}

type EnvKey = "VEF_APP_NAME" | "VEF_SINGLE_PAGE_APP" | "VEF_ENVIRONMENT";

interface EnvValueMap {
  VEF_APP_NAME: string;
  VEF_SINGLE_PAGE_APP: boolean;
  VEF_ENVIRONMENT: "development" | "production";
}
export function setEnv(
  key: EnvKey,
  value: string | undefined,
) {
  if (value === undefined) {
    value = "";
  }
  Deno.env.set(key, value);
}
export function setConfigEnv(config: EasyAppConfig<"postgres">) {
  setEnv("VEF_APP_NAME", config.appName);
  setEnv("VEF_SINGLE_PAGE_APP", config.singlePageApp ? "1" : "0");
  setEnv("VEF_ENVIRONMENT", config.environment);
}
