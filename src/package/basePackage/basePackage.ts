import { EasyPackage } from "#/package/easyPackage.ts";
import { appActions } from "./actions/appActions.ts";

import { entityActions } from "./actions/entityActions.ts";
const basePackage = new EasyPackage("base");

basePackage.addActionGroup("app", appActions);
basePackage.addActionGroup("entity", entityActions);

export { basePackage };
