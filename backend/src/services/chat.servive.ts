import { db } from '@/config/db';
import { chatsTable } from '@/models/chats.model';
import { participantsTable } from '@/models/participants.model';

interface createChatProps {
  isGroup: boolean;
  groupName?: string | undefined;
  createdBy: string;
  participants: string[];
}

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
    await tx.insert(participantsTable).values(
      participants.map(userId => ({
        userId,
        chatId: chat.id,
        isAdmin: false,
      }))
    );
    return chat;
  });
};
