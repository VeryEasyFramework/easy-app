import { EasyPack } from "#/package/easyPack.ts";
import { userEntity } from "#/package/authPackage/entities/userEntity.ts";
import { authMiddleware } from "#/package/authPackage/middleware/authMiddleware.ts";
import { userSessionEntity } from "#/package/authPackage/entities/userSession.ts";
import { registerUserAction } from "#/package/authPackage/actions/registerUserAction.ts";
import { authCheckAction } from "#/package/authPackage/actions/authCheckAction.ts";
import { loginAction } from "#/package/authPackage/actions/loginAction.ts";
import { logoutAction } from "#/package/authPackage/actions/logoutAction.ts";

const authPack: EasyPack = new EasyPack("auth", {
  description: "Package for authentication",
});

authPack.addEntity(userEntity);
authPack.addEntity(userSessionEntity);
authPack.addActionGroup("auth", [
  registerUserAction,
  authCheckAction,
  loginAction,
  logoutAction,
]);
authPack.addMiddleware(authMiddleware);

export { authPack };
