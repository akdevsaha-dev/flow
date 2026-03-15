import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { chatsTable } from './chats.model';
import { usersTable } from './users.model';

export const messagesTable = pgTable(
  'messages',
  {
    id: uuid().primaryKey().defaultRandom(),

    chatId: uuid('chat_id')
      .notNull()
      .references(() => chatsTable.id, { onDelete: 'cascade' }),

    senderId: uuid('sender_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),

    content: text('content').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => [
    index('chat_idx').on(table.chatId),
    index('created_idx').on(table.createdAt),
  ]
);
