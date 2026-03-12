import { newChat } from '@/services/chat.servive';
import { createChatSchema } from '@/validations/chat';
import type { Response, Request } from 'express';

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
    const status = 500;

    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};
