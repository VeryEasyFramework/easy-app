import type { BootAction } from "#/types.ts";
import { easyLog } from "#/log/logging.ts";

export const checkForNoUsers: BootAction = {
  actionName: "checkForUser",
  description: "Add an admin user if no users exist",
  async action(app) {
    try {
      const userCount = await app.orm.countEntities("user");
      if (userCount === 0) {
        const user = await app.orm.createEntity("user", {
          firstName: "Admin",
          lastName: "User",
          email: "admin@user.email",
          systemAdmin: true,
        });
        await user.runAction("setPassword", { password: "password" });
      }
    } catch (_e) {
      easyLog.warning(_e.message);
      easyLog.warning("Failed to create admin user");
    }
  },
};
