import { EasyPack } from "#/package/easyPack.ts";
import { userEntity } from "./entities/userEntity.ts";
import { authMiddleware } from "./middleware/authMiddleware.ts";
import { userSessionEntity } from "./entities/userSession.ts";
import { registerUserAction } from "./actions/registerUserAction.ts";
import { authCheckAction } from "./actions/authCheckAction.ts";
import { loginAction } from "./actions/loginAction.ts";
import { logoutAction } from "./actions/logoutAction.ts";
import { checkForNoUsers } from "./boot/checkForUser.ts";
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
