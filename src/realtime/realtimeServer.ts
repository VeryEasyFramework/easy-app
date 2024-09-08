import { WebsocketBase } from "#/realtime/websocketBase.ts";
import type {
   RealtimeClient,
   RealtimeClientMessage,
   RealtimeRoomDef,
} from "#/realtime/realtimeTypes.ts";
import { easyLog } from "#/log/logging.ts";
import { asyncPause } from "#/utils.ts";

class SocketRoom {
   roomName: string;
   events: Record<string, string[]>;

   constructor(roomName: string, events: string[]) {
      this.roomName = roomName;
      this.events = {};
      for (const event of events) {
         this.events[event] = [];
      }
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

   private _stop: boolean = false;
   stop() {
      this._stop = true;
      this.broker?.close();
   }
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
      this.broker = new WebSocket("ws://127.0.0.1:11254/ws");

      return new Promise<void>((resolve, reject) => {
         setTimeout(() => {
            resolve();
         }, 2000);
         this.broker!.onopen = () => {
            // easyLog.info("Broker connection established");
            this.broker!.onmessage = (event) => {
               // easyLog.info(event.data, "Broker message");
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

   info: {
      rooms: Array<RealtimeRoomDef>;
   } = {
      rooms: [],
   };

   broker!: BrokerConnection;
   async boot() {
      this.broker = new BrokerConnection();
      await this.broker.connect();
   }

   stop() {
      this.broker?.stop();
   }

   notify(room: string, event: string, data: Record<string, any>) {
      this.sendToRoomEvent(room, event, data);

      this.broker.broadcast({
         room,
         event,
         data,
      });
   }
   addRoom(room: RealtimeRoomDef) {
      const newRoom = new SocketRoom(room.roomName, room.events);
      this.rooms[room.roomName] = newRoom;
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
      const rooms = this.clients.find((c) => c.id === client.id)?.rooms;
      if (rooms) {
         for (const room of rooms) {
            this.leave(room, client.id);
         }
      }
   }

   join(room: string, clientId: string, events?: string[]): void {
      if (!this.rooms[room]) {
         return;
      }
      if (!events) {
         for (const event in this.rooms[room].events) {
            if (!this.rooms[room].events[event]?.includes(clientId)) {
               this.rooms[room].events[event]?.push(clientId);
            }
         }
      } else {
         for (const event of events) {
            if (!this.rooms[room].events[event]?.includes(clientId)) {
               this.rooms[room].events[event]?.push(clientId);
            }
         }
      }
      this.clients.find((client) => client.id === clientId)?.rooms.push(room);
      this.sendToRoomEvent(room, "join", {
         message: `Client ${clientId} joined room ${room}`,
      });
   }

   sendToRoomEvent(room: string, event: string, data: Record<string, any>) {
      if (!this.rooms[room]) {
         return;
      }
      if (!this.rooms[room].events[event]) {
         return;
      }
      this.rooms[room].events[event].forEach((clientId, index) => {
         const client = this.clients.find((client) => client.id === clientId);
         if (!client) {
            this.rooms[room].events[event].splice(index, 1);
            return;
         }
         if (client) {
            client.socket.send(JSON.stringify({
               room,
               event,
               data,
            }));
         }
      });
   }

   leave(room: string, clientId: string, events?: string[]) {
      if (!this.rooms[room]) {
         return;
      }

      if (events) {
         for (const event of events) {
            this.rooms[room].events[event] = this.rooms[room].events[event]
               .filter((
                  client,
               ) => client !== clientId);
         }
      } else {
         for (const event in this.rooms[room].events) {
            this.rooms[room].events[event] = this.rooms[room].events[event]
               .filter((
                  client,
               ) => client !== clientId);
         }
      }
      this.sendToRoomEvent(room, "leave", {
         message: `Client ${clientId} left room ${room}`,
      });
   }

   handleMessage(
      client: RealtimeClient,
      data: RealtimeClientMessage,
   ): void {
      switch (data.type) {
         case "join":
            this.join(data.room, client.id, [data.event]);
            break;
         case "leave":
            this.leave(data.room, client.id, [data.event]);
            break;
         default:
            break;
      }
   }
}
