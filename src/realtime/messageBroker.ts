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
  private static instance: MessageBroker;

  static getInstance(port?: number) {
    if (!MessageBroker.instance) {
      MessageBroker.instance = new MessageBroker(port);
    }
    return MessageBroker.instance;
  }

  realtime: RealtimeBroker;
  port: number;

  running: boolean = false;

  private constructor(port?: number) {
    this.port = port || 11254;
    this.realtime = new RealtimeBroker();
    this.running = false;
  }

  run() {
    if (this.running) {
      easyLog.warning("Realtime server already running");
      return;
    }
    this.running = true;
    const server = Deno.serve({
      port: this.port,
      hostname: "127.0.0.1",
      onListen: (addr) => {
        easyLog.warning(
          `Realtime server listening on port ${addr.port}`,
          "Realtime",
          {
            compact: true,
            hideTrace: true,
          },
        );
      },
    }, (request) => {
      const easyRequest = new EasyRequest(request);
      return this.realtime.handleUpgrade(easyRequest);
    });
    server.finished.then(() => {
      easyLog.warning("Realtime server closed");
      this.running = false;
    });
  }
}
