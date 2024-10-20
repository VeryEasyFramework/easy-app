import type { RealtimeClient } from "#/realtime/realtimeTypes.ts";
import type { EasyRequest } from "#/app/easyRequest.ts";
import type { User } from "@vef/types";
import { easyLog } from "#/log/logging.ts";

export abstract class WebsocketBase {
  clients: Map<string, RealtimeClient>;

  constructor() {
    this.clients = new Map();
  }

  handleUpgrade(easyRequest: EasyRequest): Response {
    if (easyRequest.upgradeSocket) {
      const { socket, response } = Deno.upgradeWebSocket(
        easyRequest.request,
      );
      this.addClient(socket, easyRequest.user);
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
  private addClient(socket: WebSocket, user?: User) {
    const client: RealtimeClient = {
      id: Math.random().toString(36).substring(7),
      socket,
      user,
      rooms: [],
    };
    this.addListeners(client);
    return client.id;
  }
  private addListeners(client: RealtimeClient) {
    client.socket.onopen = () => {
      this.clients.set(client.id, client);
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

      this.clients.delete(client.id);
    };
  }
  abstract handleConnection(client: RealtimeClient): void;

  abstract handleMessage(
    client: RealtimeClient,
    data: Record<string, any>,
  ): void;

  abstract handleClose(client: RealtimeClient): void;
}
