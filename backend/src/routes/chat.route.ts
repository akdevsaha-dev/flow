import { createChat } from '@/controllers/chat.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth.middleware';

export const chatRoute = Router();

chatRoute.post('/create-chat', authMiddleware, createChat);
