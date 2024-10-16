import { EasyPack } from "#/package/easyPack.ts";
import { userEntity } from "#/package/authPack/entities/userEntity.ts";
import { authMiddleware } from "#/package/authPack/middleware/authMiddleware.ts";
import { userSessionEntity } from "#/package/authPack/entities/userSession.ts";
import { registerUserAction } from "#/package/authPack/actions/registerUserAction.ts";
import { authCheckAction } from "#/package/authPack/actions/authCheckAction.ts";
import { loginAction } from "#/package/authPack/actions/loginAction.ts";
import { logoutAction } from "#/package/authPack/actions/logoutAction.ts";
import { checkForNoUsers } from "#/package/authPack/boot/checkForUser.ts";
import { userRoleEntity } from "#/package/authPack/entities/userRole.ts";
import { resetPasswordAction } from "#/package/authPack/actions/resetPasswordAction.ts";
import { setNewPasswordAction } from "#/package/authPack/actions/setNewPasswordAction.ts";
const authPack: EasyPack = new EasyPack("auth", {
  description: "Package for authentication",
});

authPack.addEntity(userEntity);
authPack.addEntity(userSessionEntity);
authPack.addEntity(userRoleEntity);
authPack.addActionGroup("auth", [
  registerUserAction,
  authCheckAction,
  loginAction,
  logoutAction,
  resetPasswordAction,
  setNewPasswordAction,
]);
authPack.addMiddleware(authMiddleware);

authPack.addBootAction(checkForNoUsers);

export { authPack };
