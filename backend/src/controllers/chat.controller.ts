import { searchUsers } from '@/services/auth.service';
import {
  findChats,
  findMessages,
  newChat,
  toggleArchiveChat,
} from '@/services/chat.service';
import { createChatSchema, toggleArchiveSchema } from '@/validations/chat';
import type { Response, Request } from 'express';

export const archiveChatHandler = async (req: Request, res: Response) => {
  try {
    const validationResult = toggleArchiveSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: validationResult.error });
    }
    const { chatId, isArchived } = validationResult.data;
    const userId = req.user.id;
    const updated = await toggleArchiveChat({ userId, chatId, isArchived });
    return res.status(200).json({
      message: `Chat ${isArchived ? 'archived' : 'unarchived'} successfully`,
      chat: updated,
    });
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Something went wrong',
    });
  }
};

export const createChat = async (req: Request, res: Response) => {
  try {
    const validationResult = createChatSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.issues,
      });
    }
    const { participants, groupName } = validationResult.data;
    const isGroup = participants.length > 1;
    const createdBy = req.user.id;
    const chat = await newChat({
      createdBy,
      isGroup,
      participants,
      ...(groupName && { groupName }),
    });
    return res.status(200).json({
      message: 'Chat created',
      chat: chat,
    });
  } catch (err: unknown) {
    let message = 'Something went wrong';
    let status = 500;
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const chats = await findChats({ userId });
    return res.status(200).json({ chats });
  } catch (err: unknown) {
    let message = 'Something went wrong';
    let status = 500;

    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId as string;
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt(req.query.limit as string) || 20;

    const data = await findMessages({
      chatId,
      cursor,
      limit,
    });

    res.json(data);
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

export const searchUsersHandler = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    if (!query) return res.status(200).json({ users: [] });

    const excludeUserId = req.user.id;
    const users = await searchUsers(query, excludeUserId);
    return res.status(200).json({ users });
  } catch (err: unknown) {
    let message = 'Something went wrong';
    const status = 500;
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};
