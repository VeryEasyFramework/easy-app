import type {
  RealtimeClient,
  RealtimeMessage,
} from "#/realtime/realtimeTypes.ts";
import type { EasyRequest } from "#/easyRequest.ts";

export abstract class WebsocketBase {
  clients: RealtimeClient[];
  constructor() {
    this.clients = [];
  }

  handleUpgrade(easyRequest: EasyRequest): Response {
    if (easyRequest.upgradeSocket) {
      const { socket, response } = Deno.upgradeWebSocket(easyRequest.request);
      this.addClient(socket);
      return response;
    }

    return new Response("request isn't trying to upgrade to websocket.", {
      status: 400,
    });
  }
  broadcast(message: string | Record<string, any>): void {
    if (typeof message === "object") {
      message = JSON.stringify(message);
    }
    this.clients.forEach((client) => {
      client.socket.send(JSON.stringify({ message }));
    });
  }
  private addClient(socket: WebSocket) {
    const client: RealtimeClient = {
      id: Math.random().toString(36).substring(7),
      socket,
      rooms: [],
    };
    this.addListeners(client);
    return client.id;
  }
  private addListeners(client: RealtimeClient) {
    client.socket.onopen = () => {
      this.clients.push(client);
      this.handleConnection(client);
    };
    client.socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.error("Error parsing JSON data from client", e);
      }
      this.handleMessage(client, data);
    };
    client.socket.onclose = () => {
      this.handleClose(client);

      this.clients = this.clients.filter((c) => c.id !== client.id);
    };
  }
  abstract handleConnection(client: RealtimeClient): void;

  abstract handleMessage(
    client: RealtimeClient,
    data: Record<string, any>,
  ): void;

  abstract handleClose(client: RealtimeClient): void;
}
