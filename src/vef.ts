import { EasyApp } from "../mod.ts";

const vefGlobal = globalThis as VefGlobal;
type VefGlobal = typeof globalThis & {
  VEF: {
    running: boolean;
    app: EasyApp;
  };
};
function hasVef() {
  return "VEF" in globalThis;
}

function setVefValue<K extends keyof VefGlobal["VEF"]>(
  key: K,
  value: VefGlobal["VEF"][K],
) {
  if (!hasVef()) {
    throw new Error("VEF app does not exist");
  }
  vefGlobal.VEF![key] = value;
}
function getVefValue<K extends keyof VefGlobal["VEF"]>(
  key: K,
): VefGlobal["VEF"][K] {
  if (!hasVef()) {
    throw new Error("VEF app does not exist");
  }
  return vefGlobal.VEF![key];
}
export const VEF = {
  createApp(appName: string) {
    if (hasVef()) {
      throw new Error("VEF app already exists");
    }
    const app = new EasyApp();
    vefGlobal.VEF = { app, running: false };
    return app;
  },
  get app(): EasyApp {
    if (!hasVef()) {
      throw new Error("VEF app does not exist");
    }
    return vefGlobal.VEF!.app;
  },
  run() {
    setVefValue("running", true);
    getVefValue("app").run();
  },
};
