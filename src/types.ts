import type { EasyApp } from "#/easyApp.ts";

export interface BootAction {
  actionName: string;
  description?: string;
  action: (app: EasyApp) => Promise<void> | void;
}
