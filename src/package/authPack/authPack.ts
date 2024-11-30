import { EasyPack } from "#/package/easyPack.ts";
import { userEntry } from "#/package/authPack/entryTypes/userEntry.ts";
import { authMiddleware } from "#/package/authPack/middleware/authMiddleware.ts";
import { userSessionEntry } from "#/package/authPack/entryTypes/userSession.ts";
import { registerUserAction } from "#/package/authPack/actions/registerUserAction.ts";
import { authCheckAction } from "#/package/authPack/actions/authCheckAction.ts";
import { loginAction } from "#/package/authPack/actions/loginAction.ts";
import { logoutAction } from "#/package/authPack/actions/logoutAction.ts";
import { checkForNoUsers } from "#/package/authPack/boot/checkForUser.ts";
import { userRoleEntry } from "#/package/authPack/entryTypes/userRole.ts";
import { resetPasswordAction } from "#/package/authPack/actions/resetPasswordAction.ts";
import { setNewPasswordAction } from "#/package/authPack/actions/setNewPasswordAction.ts";

export const authPack: EasyPack = new EasyPack("authPack", {
  description: "Package for authentication",
});

authPack.addEntryType(userEntry);
authPack.addEntryType(userSessionEntry);
authPack.addEntryType(userRoleEntry);
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
