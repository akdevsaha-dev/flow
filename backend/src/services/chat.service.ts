import { db } from '@/config/db';
import { chatsTable } from '@/models/chats.model';
import { messagesTable } from '@/models/message.model';
import { participantsTable } from '@/models/participants.model';
import type { createChatProps, findMessagesProps } from '@/types';
import { and, desc, eq, lt, ne } from 'drizzle-orm';

export const newChat = async ({
  isGroup,
  participants,
  groupName,
  createdBy,
}: createChatProps) => {
  return await db.transaction(async tx => {
    const [chat] = await tx
      .insert(chatsTable)
      .values({
        isGroup,
        groupName,
        createdBy,
      })
      .returning();
    if (!chat) {
      throw new Error('Failed to create chat');
    }
    await tx.insert(participantsTable).values([
      { userId: createdBy, chatId: chat.id, isAdmin: true },
      ...participants.map(userId => ({
        userId,
        chatId: chat.id,
        isAdmin: false,
      })),
    ]);
    return chat;
  });
};

export const findChats = async ({ userId }: { userId: string }) => {
  const rawChats = await db.query.participantsTable.findMany({
    where: (participants, { eq }) => eq(participants.userId, userId),
    with: {
      chat: {
        with: {
          lastMessage: {
            with: { sender: true },
          },
          participants: {
            where: (participants, { ne }) => ne(participants.userId, userId),
            with: { user: true },
          },
        },
      },
    },
  });

  const formattedChats = rawChats.map(p => {
    const chat = p.chat;
    const lastMsg = chat?.lastMessage;

    const allOtherMembers =
      chat?.participants?.map(p => ({
        id: p.user.id,
        name: p.user.username,
        avatar: p.user.avatarUrl,
      })) || [];

    return {
      id: chat?.id,
      isGroup: chat?.isGroup,
      groupName: chat?.groupName,
      lastMessageId: chat?.lastMessageId,
      lastMessage: lastMsg?.content,
      lastMessageTime: lastMsg?.createdAt,
      lastMessageSenderId: lastMsg?.sender?.id,
      lastMessageSenderName: lastMsg?.sender?.username,
      lastMessageSenderAvatar: lastMsg?.sender?.avatarUrl,

      otherParticipants: allOtherMembers,
    };
  });

  return formattedChats.sort((a, b) => {
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return timeB - timeA;
  });
};

export const findMessages = async ({
  chatId,
  cursor,
  limit,
}: findMessagesProps) => {
  const safeLimit = Math.min(Number(limit) || 20, 50);

  const conditions = [eq(messagesTable.chatId, chatId)];
  if (cursor) {
    conditions.push(lt(messagesTable.createdAt, new Date(cursor)));
  }
  const messages = await db
    .select()
    .from(messagesTable)
    .where(and(...conditions))
    .orderBy(desc(messagesTable.createdAt))
    .limit(safeLimit);

  return {
    messages,
    nextCursor: messages.at(-1)?.createdAt ?? null,
  };
};
