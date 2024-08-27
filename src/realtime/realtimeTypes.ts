export interface RealtimeClient {
  id: string;
  socket: WebSocket;
  rooms: string[];
}

export interface RealtimeRoomDef {
  roomName: string;
  description?: string;
  events: string[];
}
export interface RealtimeMessage {
  room: string;
  event: string;
  data: Record<string, any>;
}

export interface RealtimeClientMessage extends RealtimeMessage {
  type: "join" | "leave" | "message";
}
