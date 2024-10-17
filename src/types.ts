import type { EasyApp } from "#/app/easyApp.ts";

export interface BootAction {
  actionName: string;
  description?: string;
  action: (app: EasyApp) => Promise<void> | void;
}

export interface InitAction extends BootAction {}
