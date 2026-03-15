import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { WebSocketServer } from 'ws';
import type { CustomWebSocket } from '@/types/websocket';
import { broadcastToChat, joinChat, leaveChat, sendJson } from './helpers.ws';
import { db } from '@/config/db';
import { messagesTable } from '@/models/message.model';
import { chatsTable } from '@/models/chats.model';
import { participantsTable } from '@/models/participants.model';
import { and, eq } from 'drizzle-orm';

import {
  sendMessageSchema,
  typingStartSchema,
  typingStopSchema,
  joinChatSchema,
  leaveChatSchema,
  markReadSchema,
} from '@/validations/ws/wsvalidation';

export function attachWebsockerServer(server: HttpServer | HttpsServer) {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
    maxPayload: 1024 * 1024,
  });

  wss.on('connection', (socket: CustomWebSocket) => {
    socket.isAlive = true;

    socket.on('pong', () => {
      socket.isAlive = true;
    });

    sendJson(socket, { type: 'Welcome' });

    socket.on('error', console.error);

    socket.on('message', async data => {
      let payload: any;

      try {
        payload = JSON.parse(data.toString());
      } catch {
        console.warn('Invalid JSON received');
        return;
      }

      switch (payload.type) {
        case 'send_message': {
          const parsed = sendMessageSchema.safeParse(payload);
          if (!parsed.success) return;

          const { chatId, senderId, content } = parsed.data;

          const message = await db.transaction(async tx => {
            const [msg] = await tx
              .insert(messagesTable)
              .values({
                chatId,
                senderId,
                content,
              })
              .returning();

            await tx
              .update(chatsTable)
              .set({
                lastMessageId: msg?.id,
              })
              .where(eq(chatsTable.id, chatId));

            return msg;
          });

          broadcastToChat(chatId, {
            type: 'new_message',
            data: message,
          });

          break;
        }

        case 'typing_start': {
          const parsed = typingStartSchema.safeParse(payload);
          if (!parsed.success) return;

          const { chatId, userId } = parsed.data;

          broadcastToChat(chatId, {
            type: 'user_typing_start',
            data: { userId },
          });

          break;
        }
        case 'typing_stop': {
          const parsed = typingStopSchema.safeParse(payload);
          if (!parsed.success) return;

          const { chatId, userId } = parsed.data;

          broadcastToChat(chatId, {
            type: 'user_typing_stop',
            data: { userId },
          });

          break;
        }

        case 'join_chat': {
          const parsed = joinChatSchema.safeParse(payload);
          if (!parsed.success) return;

          const { chatId } = parsed.data;

          joinChat(chatId, socket);

          break;
        }

        case 'leave_chat': {
          const parsed = leaveChatSchema.safeParse(payload);
          if (!parsed.success) return;

          const { chatId } = parsed.data;

          leaveChat(chatId, socket);

          break;
        }

        case 'mark_read': {
          const parsed = markReadSchema.safeParse(payload);
          if (!parsed.success) return;

          const { chatId, userId, messageId } = parsed.data;

          await db
            .update(participantsTable)
            .set({
              lastReadMessageId: messageId,
            })
            .where(
              and(
                eq(participantsTable.chatId, chatId),
                eq(participantsTable.userId, userId)
              )
            );

          broadcastToChat(chatId, {
            type: 'message_read',
            data: {
              userId,
              messageId,
            },
          });

          break;
        }

        default:
          console.warn('Unknown websocket event', payload.type);
      }
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach(client => {
      const socket = client as CustomWebSocket;

      if (!socket.isAlive) {
        return socket.terminate();
      }

      socket.isAlive = false;

      socket.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
}
