import { db } from '@/config/db';
import { chatsTable } from '@/models/chats.model';
import { participantsTable } from '@/models/participants.model';
import type { createChatProps } from '@/types';
import { eq } from 'drizzle-orm';


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
    await tx
      .insert(participantsTable)
      .values([
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
  const chats = await db
    .select({
      id: chatsTable.id,
      isGroup: chatsTable.isGroup,
      groupName: chatsTable.groupName,
    })
    .from(participantsTable)
    .innerJoin(chatsTable, eq(participantsTable.chatId, chatsTable.id))
    .where(eq(participantsTable.userId, userId));
  return chats;
};
