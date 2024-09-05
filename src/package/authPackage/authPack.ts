import { EasyPack } from "#/package/easyPack.ts";
import { userEntity } from "#/package/authPackage/entities/userEntity.ts";
import { authMiddleware } from "#/package/authPackage/middleware/authMiddleware.ts";
import { userSessionEntity } from "#/package/authPackage/entities/userSession.ts";

const authPack: EasyPack = new EasyPack("auth", {
  description: "Package for authentication",
});

authPack.addEntity(userEntity);
authPack.addEntity(userSessionEntity);

// authPackage.addMiddleware(authMiddleware);

export { authPack };
