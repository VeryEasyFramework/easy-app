export interface SocketEventInit {
  room: string;
  event: string;
  data: Record<string, any>;
}

export class SocketEvent extends CustomEvent<SocketEventInit> {
}

export function dispatchSocketEvent(
  room: string,
  event: string,
  data: Record<string, any>,
) {
  const eventInit: SocketEventInit = {
    room,
    event,
    data,
  };
  dispatchEvent(new SocketEvent("socket-message", { detail: eventInit }));
}

interface SocketClient {
  id: string;
  socket: WebSocket;
  rooms: string[];
}

export interface SocketRoomDef {
  name: string;
  events: string[];
}

class SocketRoom {
  name: string;
  events: Record<string, string[]>;

  constructor(name: string, events: string[]) {
    this.name = name;
    this.events = {};
    for (const event of events) {
      this.events[event] = [];
    }
  }
}

export class RealtimeServer {
  clients: SocketClient[];
  rooms: Record<string, SocketRoom> = {};

  constructor(rooms?: SocketRoom[]) {
    this.clients = [];
    if (rooms) {
      for (const room of rooms) {
        this.rooms[room.name] = room;
      }
    }
    addEventListener("socket-message", (e) => {
      const event = e as SocketEvent;
      this.sendToRoomEvent(
        event.detail.room,
        event.detail.event,
        event.detail.data,
      );
    });
  }

  addRoom(room: SocketRoomDef) {
    const newRoom = new SocketRoom(room.name, room.events);
    this.rooms[room.name] = newRoom;
  }

  addRooms(rooms: SocketRoomDef[]) {
    for (const room of rooms) {
      this.addRoom(room);
    }
  }

  addClient(socket: WebSocket) {
    const id = Math.random().toString(36).substring(7);
    this.clients.push({ id, socket, rooms: [] });
    return id;
  }

  broadcast(message: string | Record<string, any>) {
    if (typeof message === "object") {
      message = JSON.stringify(message);
    }
    this.clients.forEach((client) => {
      client.socket.send(JSON.stringify({ message }));
    });
  }

  handleUpgrade(req: Request) {
    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() != "websocket") {
      return new Response("request isn't trying to upgrade to websocket.");
    }
    const { socket, response } = Deno.upgradeWebSocket(req);
    const id = this.addClient(socket);
    socket.onopen = () => {
      socket.send(JSON.stringify({ message: "Connected to server" }));
      this.broadcast(`Client ${id} connected`);
    };
    socket.onmessage = (e) => {
      this.handleMessage(e.data, id);
    };
    socket.onerror = (e) => {
      if (e instanceof ErrorEvent) {
        console.error(`Socket error: ${e.message}`, "Error", "SocketServer");
      }
    };
    socket.onclose = () => {
      const rooms = this.clients.find((client) => client.id === id)?.rooms;
      if (rooms) {
        for (const room of rooms) {
          this.leave(room, id);
        }
      }
      this.clients = this.clients.filter((client) => client.id !== id);
    };
    return response;
  }

  join(room: string, clientId: string, events?: string[]) {
    if (!this.rooms[room]) {
      return false;
    }
    if (!events) {
      for (const event in this.rooms[room].events) {
        if (!this.rooms[room].events[event].includes(clientId)) {
          this.rooms[room].events[event].push(clientId);
        }
      }
    } else {
      for (const event of events) {
        if (!this.rooms[room].events[event].includes(clientId)) {
          this.rooms[room].events[event].push(clientId);
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
    for (const event in this.rooms[room].events) {
      this.rooms[room].events[event] = this.rooms[room].events[event].filter((
        client,
      ) => client !== clientId);
    }
    this.sendToRoomEvent(room, "leave", {
      message: `Client ${clientId} left room ${room}`,
    });
  }

  handleMessage(message: string, id: string) {
    const parsed = JSON.parse(message);
    switch (parsed.type) {
      case "join":
        this.join(parsed.room, id, [parsed.event]);
        break;
      case "leave":
        this.leave(parsed.room, id, [parsed.event]);
        break;
      default:
        break;
    }
  }
}
