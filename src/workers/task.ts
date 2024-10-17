import type { EasyApp } from "#/app/easyApp.ts";

export class EasyWorker {
  worker!: Worker;
  app!: EasyApp;
  constructor(app?: EasyApp) {
    this.app = app as EasyApp;
    this.init();
  }
  async init() {
    this.worker = self as unknown as Worker;
    this.worker.onmessage = (event) => {
      console.log("message received");
      console.log(event.data);

      this.send(this.app.orm.registry);
    };
  }

  async send(message: any) {
    this.worker.postMessage(message);
  }
}
