import { db } from '@/config/db';
import { chatsTable } from '@/models/chats.model';
import { messagesTable } from '@/models/message.model';
import { participantsTable } from '@/models/participants.model';
import { contactsTable } from '@/models/contacts.model';
import type { createChatProps, findMessagesProps } from '@/types';
import { and, desc, eq, lt, ne } from 'drizzle-orm';

export const newChat = async ({
  isGroup,
  participants,
  groupName,
  createdBy,
}: createChatProps) => {
  if (!isGroup && participants.length === 1) {
    const targetUserId = participants[0];

    const existingChat = await db.transaction(async tx => {
      const commonChats = await tx
        .select({ chatId: participantsTable.chatId })
        .from(participantsTable)
        .innerJoin(chatsTable, eq(participantsTable.chatId, chatsTable.id))
        .where(
          and(
            eq(chatsTable.isGroup, false),
            eq(participantsTable.userId, createdBy as string)
          )
        );

      for (const { chatId } of commonChats) {
        const otherParticipant = await tx
          .select()
          .from(participantsTable)
          .where(
            and(
              eq(participantsTable.chatId, chatId),
              eq(participantsTable.userId, targetUserId as string)
            )
          )
          .limit(1);

        if (otherParticipant.length > 0) {
          return chatId;
        }
      }
      return null;
    });

    if (existingChat) {
      const [chat] = await db
        .select()
        .from(chatsTable)
        .where(eq(chatsTable.id, existingChat))
        .limit(1);
      return chat;
    }
  }

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
  const myParticipants = await db
    .select({
      chatId: participantsTable.chatId,
      isArchived: participantsTable.isArchived,
      unreadCount: participantsTable.unreadCount,
    })
    .from(participantsTable)
    .where(eq(participantsTable.userId, userId));

  if (myParticipants.length === 0) return [];

  const chatIds = myParticipants.map(p => p.chatId);

  const chats = await db.query.chatsTable.findMany({
    where: (chats, { inArray }) => inArray(chats.id, chatIds),
    with: {
      lastMessage: {
        with: { sender: true },
      },
      participants: {
        where: (participants, { ne }) => ne(participants.userId, userId),
        with: { user: true },
      },
    },
  });

  const contacts = await db
    .select()
    .from(contactsTable)
    .where(eq(contactsTable.ownerId, userId));

  const contactMap = new Map(contacts.map(c => [c.contactId, c]));

  const formattedChats = chats.map(chat => {
    const myParticipantData = myParticipants.find(p => p.chatId === chat.id);
    const lastMsg = chat.lastMessage;

    const allOtherMembers = chat.participants.map(p => {
      const contact = contactMap.get(p.user.id);
      return {
        id: p.user.id,
        name: contact?.nickName || p.user.username,
        username: p.user.username,
        avatar: p.user.avatarUrl,
        isBlocked: contact?.isBlocked || false,
      };
    });

    return {
      id: chat.id,
      isGroup: chat.isGroup,
      groupName: chat.groupName,
      lastMessageId: chat.lastMessageId,
      lastMessage: lastMsg?.content,
      lastMessageTime: lastMsg?.createdAt,
      lastMessageSenderId: lastMsg?.sender?.id,
      lastMessageSenderName: lastMsg?.sender?.username,
      lastMessageSenderAvatar: lastMsg?.sender?.avatarUrl,
      isArchived: myParticipantData?.isArchived || false,
      unreadCount: myParticipantData?.unreadCount || 0,
      otherParticipants: allOtherMembers,
    };
  });

  return formattedChats.sort((a, b) => {
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return timeB - timeA;
  });
};

export const toggleArchiveChat = async ({
  userId,
  chatId,
  isArchived,
}: {
  userId: string;
  chatId: string;
  isArchived: boolean;
}) => {
  const [updated] = await db
    .update(participantsTable)
    .set({ isArchived })
    .where(
      and(
        eq(participantsTable.userId, userId),
        eq(participantsTable.chatId, chatId)
      )
    )
    .returning();
  return updated;
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
