import {
  archiveChatHandler,
  createChat,
  getChats,
  getMessages,
} from '@/controllers/chat.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth.middleware';

export const chatRoute = Router();

chatRoute.post('/create-chat', authMiddleware, createChat);
chatRoute.get('/get-chats', authMiddleware, getChats);
chatRoute.get(
  '/:chatId/messages',
  authMiddleware,
  getMessages
);
chatRoute.put('/archive', authMiddleware, archiveChatHandler);
