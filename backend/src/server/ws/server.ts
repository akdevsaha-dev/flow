import type { CustomWebSocket } from '@/types/websocket';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { WebSocket, WebSocketServer } from 'ws';
function sendJson(socket: WebSocket, payload: object) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function broadcast(wss: WebSocketServer, payload: object) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}


export function attachWebsockerServer(server: HttpServer | HttpsServer) {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
    maxPayload: 1024 * 1024,
  });
  wss.on('connection', (socket: CustomWebSocket) => {
    socket.isAlive = true;
    socket.on('pong', () => (socket.isAlive = true));
    sendJson(socket, { type: 'Welcome' });
    socket.on('error', console.error);
  });

  const interval = setInterval(() => {
    wss.clients.forEach(client => {
      const socket = client as CustomWebSocket;
      if (!socket.isAlive) return socket.terminate();
      socket.isAlive = false;
      socket.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
}
