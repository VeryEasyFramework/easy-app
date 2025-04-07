import type { User } from "#/vef-types/mod.ts";

export interface RealtimeClient {
  id: string;
  socket: WebSocket;
  user?: User;
  rooms: string[];
}

export interface RealtimeRoomDef {
  roomName: string;
  description?: string;
}
export interface RealtimeMessage {
  room: string;
  event: string;
  data: Record<string, any>;
}

export interface RealtimeClientMessage extends RealtimeMessage {
  type: "join" | "leave" | "message";
}
