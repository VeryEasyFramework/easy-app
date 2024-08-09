export interface SocketRoom {
  name: string;
  events: Record<string, string[]>;
}

export class RealtimeClient {
  socket!: WebSocket;
  host: string;
  rooms: { name: string; events: string[] }[] = [];

  get connected() {
    return this.socket.readyState === WebSocket.OPEN;
  }

  get connecting() {
    return this.socket.readyState === WebSocket.CONNECTING;
  }

  get closed() {
    return this.socket.readyState === WebSocket.CLOSED;
  }

  constructor(host?: string) {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    this.host = host || `${protocol}://${window.location.host}/ws`;
  }

  connect(connectedCallback?: () => void) {
    this.socket = new WebSocket(this.host);
    this.socket.addEventListener("open", (event) => {
      connectedCallback?.();
      this.rejoinRooms();
      this.socket.addEventListener("close", async (event) => {
        this.retryReconnect(1000);
      });
      this.socket.addEventListener("message", (event) => {
      });
    });
    this.socket.addEventListener("error", (event) => {
      // console.log("socket error", event);
    });
  }

  retryReconnect(attempts: number) {
    let count = 0;
    const interval = setInterval(() => {
      if (count >= attempts) {
        clearInterval(interval);
        return;
      }
      if (this.connected) {
        clearInterval(interval);
        return;
      }
      if (this.closed) {
        count++;
        console.log(`Reconnecting... ${count}/${attempts}`);
        this.reconnect();
      }
    }, 1000);
  }

  reconnect() {
    if (this.closed) {
      this.connect();
    }
  }

  rejoinRooms() {
    for (const room of this.rooms) {
      if (room.events.length === 0) {
        this.send({ type: "join", room: room.name });
        return;
      }
      for (const event of room.events) {
        this.send({ type: "join", room: room.name, event });
      }
    }
  }

  join(room: string, event: string, callback: (data: any) => void) {
    this.socket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      if (data.room !== room || data.event !== event) return;
      callback(data.data);
    });
    if (!this.rooms.find((r) => r.name === room)) {
      this.rooms.push({ name: room, events: [event] });
    } else {
      this.rooms = this.rooms.map((r) => {
        if (r.name === room) {
          r.events.push(event);
        }
        return r;
      });
    }
    this.send({ type: "join", room, event });
  }

  leave(room: string, event?: string) {
    if (event) {
      this.rooms = this.rooms.map((r) => {
        if (r.name === room) {
          r.events = r.events.filter((e) => e !== event);
        }
        return r;
      });
    } else {
      this.rooms = this.rooms.filter((r) => r.name !== room);
    }
    this.send({ type: "leave", room, event });
  }

  send(message: Record<string, any>) {
    if (!this.connected) {
      return;
    }
    this.socket.send(JSON.stringify(message));
  }
}
