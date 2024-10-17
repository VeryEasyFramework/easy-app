import { WebsocketBase } from "#/realtime/websocketBase.ts";
import { EasyRequest } from "#/app/easyRequest.ts";
import type { RealtimeClient } from "#/realtime/realtimeTypes.ts";
import { easyLog } from "#/log/logging.ts";

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
  port: number;
  constructor(port?: number) {
    this.port = port || 11254;
    this.realtime = new RealtimeBroker();
  }

  run() {
    Deno.serve({
      port: this.port,
      hostname: "127.0.0.1",
      onListen: (addr) => {
        easyLog.info(`Realtime server listening on port ${addr.port}`);
      },
    }, (request) => {
      const easyRequest = new EasyRequest(request);
      return this.realtime.handleUpgrade(easyRequest);
    });
  }
}
