import { z } from 'zod';

export const sendMessageSchema = z.object({
  type: z.literal('send_message'),
  chatId: z.string(),
  content: z.string().min(1),
});

export const typingStartSchema = z.object({
  type: z.literal('typing_start'),
  chatId: z.string(),
});

export const typingStopSchema = z.object({
  type: z.literal('typing_stop'),
  chatId: z.string(),
});

export const joinChatSchema = z.object({
  type: z.literal('join_chat'),
  chatId: z.string(),
});

export const leaveChatSchema = z.object({
  type: z.literal('leave_chat'),
  chatId: z.string(),
});

export const markReadSchema = z.object({
  type: z.literal('mark_read'),
  chatId: z.string(),
  messageId: z.string(),
});
