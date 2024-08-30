import { EasyPack } from "#/package/easyPack.ts";
import { userEntity } from "#/package/authPackage/entities/userEntity.ts";
import { authMiddleware } from "#/package/authPackage/middleware/authMiddleware.ts";

const authPack = new EasyPack("auth", {
  description: "Package for authentication",
});

authPack.addEntity(userEntity);

// authPackage.addMiddleware(authMiddleware);

export { authPack };
