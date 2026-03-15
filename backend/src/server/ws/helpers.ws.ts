import type { CustomWebSocket } from '@/types/websocket';
import type { WebSocketServer } from 'ws';

export function sendJson(socket: CustomWebSocket, payload: object) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

export function broadcast(wss: WebSocketServer, payload: object) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}

export const chatRooms = new Map<string, Set<CustomWebSocket>>();

export function joinChat(chatId: string, socket: CustomWebSocket) {
  if (!chatRooms.has(chatId)) {
    chatRooms.set(chatId, new Set());
  }
  chatRooms.get(chatId)!.add(socket);
}

export function leaveChat(chatId: string, socket: CustomWebSocket) {
  const sockets = chatRooms.get(chatId);
  if (!sockets) return;
  sockets.delete(socket);
  if (sockets.size === 0) {
    chatRooms.delete(chatId);
  }
}
export function broadcastToChat(chatId: string, payload: object) {
  const sockets = chatRooms.get(chatId);
  if (!sockets) return;
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      sendJson(socket, payload);
    }
  }
}
