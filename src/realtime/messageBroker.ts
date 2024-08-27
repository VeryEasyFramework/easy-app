import { WebsocketBase } from "#/realtime/websocketBase.ts";
import { EasyRequest } from "#/easyRequest.ts";
import type { RealtimeClient } from "#/realtime/realtimeTypes.ts";

class RealtimeBroker extends WebsocketBase {
  handleConnection(_client: RealtimeClient): void {
  }
  handleMessage(_client: RealtimeClient, data: Record<string, any>): void {
    this.broadcast(data);
  }
  handleClose(_client: RealtimeClient): void {
  }
}

export class MessageBroker {
  realtime: RealtimeBroker;
  constructor() {
    this.realtime = new RealtimeBroker();
  }

  run() {
    Deno.serve({
      port: 11254,
      hostname: "127.0.0.1",
    }, async (request) => {
      const easyRequest = new EasyRequest(request);
      return this.realtime.handleUpgrade(easyRequest);
    });
  }
}
