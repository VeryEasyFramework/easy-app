import { createMiddleware } from "#/middleware/middleware.ts";
import { getEnv } from "#/appConfig/configEnv.ts";

const env = getEnv("VEF_ENVIRONMENT");
export const requestOptionsMiddleware = createMiddleware(
  (_app, easyRequest, easyResponse) => {
    if (env == "production") {
      easyResponse.setAllowOrigin(
        easyRequest.originalUrl,
      );
      return;
    }
    easyResponse.setAllowOrigin(
      easyRequest.request.headers.get("origin") || "*",
    );
  },
);
