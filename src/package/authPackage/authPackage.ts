import { EasyPackage } from "#/package/easyPackage.ts";
import { userEntity } from "#/package/authPackage/entities/userEntity.ts";
import { authMiddleware } from "./middleware/authMiddleware.ts";

const authPackage = new EasyPackage("auth", {
  description: "Package for authentication",
});

authPackage.addEntity(userEntity);

authPackage.addMiddleware(authMiddleware);

export { authPackage };
