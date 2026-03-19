import { boolean, integer, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './users.model';
import { chatsTable } from './chats.model';

export const participantsTable = pgTable(
  'participants',
  {
    id: uuid().primaryKey().defaultRandom(),
    lastReadMessageId: uuid('last_read_message_id'),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    chatId: uuid('chat_id')
      .notNull()
      .references(() => chatsTable.id, { onDelete: 'cascade' }),
    isAdmin: boolean('is_admin').default(false).notNull(),
    isArchived: boolean('is_archived').default(false).notNull(),
    unreadCount: integer('unread_count').default(0).notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  table => [unique('uniqueMembership').on(table.userId, table.chatId)]
);

export const participantsRelation = relations(participantsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [participantsTable.userId],
    references: [usersTable.id],
  }),
  chat: one(chatsTable, {
    fields: [participantsTable.chatId],
    references: [chatsTable.id],
  }),
}));
