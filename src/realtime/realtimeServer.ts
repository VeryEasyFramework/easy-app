import { WebsocketBase } from "#/realtime/websocketBase.ts";
import type {
  RealtimeClient,
  RealtimeClientMessage,
  RealtimeRoomDef,
} from "#/realtime/realtimeTypes.ts";
import { easyLog } from "#/log/logging.ts";
import { asyncPause } from "#/utils.ts";
import type { SafeType, User } from "@vef/types";
import type { EasyCache } from "#/cache/cache.ts";

class SocketRoom {
  roomName: string;

  clients: string[] = [];
  users: User[] = [];
  constructor(roomName: string) {
    this.roomName = roomName;
  }
}

type ConnectionStatus =
  | "CONNECTING"
  | "OPEN"
  | "CLOSING"
  | "CLOSED"
  | "UNKNOWN";
class BrokerConnection {
  broker?: WebSocket;
  port: number = 11254;
  private _stop: boolean = false;

  constructor(port?: number) {
    if (port) {
      this.port = port;
    }
  }
  stop() {
    this._stop = true;
    this.broker?.close();
  }
  onMessage: (data: RealtimeClientMessage) => void = () => {};
  get connected(): boolean {
    return this.broker?.readyState === WebSocket.OPEN;
  }
  get closed(): boolean {
    if (!this.broker) {
      return true;
    }

    return this.broker.readyState === WebSocket.CLOSED;
  }

  get closing(): boolean {
    return this.broker?.readyState === WebSocket.CLOSING;
  }

  get connecting(): boolean {
    return this.broker?.readyState === WebSocket.CONNECTING;
  }

  get connectionStatus(): ConnectionStatus {
    const status = this.broker?.readyState;
    switch (status) {
      case WebSocket.CONNECTING:
        return "CONNECTING";
      case WebSocket.OPEN:
        return "OPEN";
      case WebSocket.CLOSING:
        return "CLOSING";
      case WebSocket.CLOSED:
        return "CLOSED";
      default:
        return "UNKNOWN";
    }
  }
  private _connect() {
    this.broker = new WebSocket(`ws://127.0.0.1:${this.port}/ws`);

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
      this.broker!.onopen = () => {
        this.broker!.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const message = data.message;

          const eventData: RealtimeClientMessage = JSON.parse(message);
          this.onMessage(eventData);
        };
        this.broker!.onclose = () => {
          // easyLog.error("Broker connection closed", "Broker", true);
          this.reconnect();
        };
        resolve();
      };
    });
  }
  async connect() {
    await this.reconnect();
  }
  private async reconnect() {
    while (this.closed) {
      if (this.connected || this._stop) {
        break;
      }
      await this._connect();
      await asyncPause(1000);
    }
  }
  broadcast(message: Record<string, any>) {
    if (!this.connected) {
      easyLog.error("Broker not connected", "Broker", {
        hideTrace: true,
      });
      return;
    }
    this.broker!.send(JSON.stringify(message));
  }
}

export class RealtimeServer extends WebsocketBase {
  rooms: Record<string, SocketRoom> = {};
  brokerPort: number = 11254;
  constructor(port?: number) {
    super();
    if (port) {
      this.brokerPort = port;
    }
  }
  info: {
    rooms: Array<RealtimeRoomDef>;
  } = {
    rooms: [],
  };
  appId: string = "";

  broker!: BrokerConnection;
  onCache: (
    operation: keyof EasyCache,
    content: Record<string, any>,
  ) => void = () => {};
  async boot() {
    this.broker = new BrokerConnection(this.brokerPort);
    this.broker.onMessage = (data) => {
      if (data.event === "join" || data.event === "leave") {
        this.validateRoom(data.room);
        const user = data.data.user;
        const room = this.rooms[data.room];
        if (data.event === "join") {
          room.users.push(user);
        }
        if (data.event === "leave") {
          room.users = room.users.filter((u) => u.id !== user.id);
        }
      }
      this.sendToRoom(data.room, data.event, data.data);
    };
    await this.broker.connect();
  }

  stop() {
    this.broker?.stop();
  }

  notify(room: string, event: string, data: Record<string, any>) {
    easyLog.info(data, this.appId);
    // this.sendToRoom(room, event, data);

    this.broker.broadcast({
      room,
      event,
      data,
    });
  }
  addRoom(room: RealtimeRoomDef) {
    if (this.rooms[room.roomName]) {
      return;
    }
    this.rooms[room.roomName] = new SocketRoom(room.roomName);
    this.info.rooms.push(room);
  }

  addRooms(rooms: RealtimeRoomDef[]) {
    for (const room of rooms) {
      this.addRoom(room);
    }
  }

  handleConnection(_client: RealtimeClient): void {
  }
  handleClose(client: RealtimeClient): void {
    const rooms = this.clients.get(client.id)?.rooms;
    if (rooms) {
      for (const room of rooms) {
        this.leave(room, client, {});
      }
    }
  }
  private validateRoom(room: string) {
    if (!this.rooms[room]) {
      this.addRoom({
        roomName: room,
      });
      return;
    }
  }
  join(room: string, client: RealtimeClient, data: any): void {
    easyLog.info(data, this.appId);
    this.validateRoom(room);

    if (!this.rooms[room].clients.includes(client.id)) {
      this.rooms[room].clients.push(client.id);
    }

    if (!client) {
      return;
    }
    if (!client.rooms.includes(room)) {
      client.rooms.push(room);
    }
    if (!this.rooms[room].users.find((u) => u.id === client.user?.id)) {
      this.rooms[room].users.push(client.user!);
    }
    this.notify(room, "join", {
      room,
      user: client.user,
      users: this.rooms[room].users,
    });
  }

  sendToRoom(room: string, event: string, data: Record<string, any>) {
    if (room === "cache") {
      const operation = event as keyof EasyCache;
      this.onCache(operation, data);
    }
    this.validateRoom(room);
    this.rooms[room].clients.forEach((clientId, index) => {
      const client = this.clients.get(clientId);
      if (!client) {
        this.rooms[room].clients.splice(index, 1);
        return;
      }
      client.socket.send(JSON.stringify({
        room,
        event,
        data,
      }));
    });
  }

  leave(room: string, client: RealtimeClient, data: any): void {
    this.validateRoom(room);
    this.rooms[room].clients = this.rooms[room].clients.filter((c) =>
      c !== client.id
    );

    this.rooms[room].users = this.rooms[room].users.filter((u) =>
      u.id !== client.user?.id
    );

    if (client) {
      if (client.rooms.includes(room)) {
        client.rooms = client.rooms.filter((r) => r !== room);
      }
      this.notify(room, "leave", {
        room,
        user: client.user,
        users: this.rooms[room].users,
      });
    }
  }

  cache(operation: string, content: Record<string, SafeType>) {
    this.broker.broadcast({
      room: "cache",
      event: operation,
      data: content,
    });
  }

  handleMessage(
    client: RealtimeClient,
    data: RealtimeClientMessage,
  ): void {
    switch (data.type) {
      case "join":
        this.join(data.room, client, data);
        break;
      case "leave":
        this.leave(data.room, client, data);
        break;
      default:
        break;
    }
  }
}
