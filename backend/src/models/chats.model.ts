import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { participantsTable } from './participants.model';
import { usersTable } from './users.model';

export const chatsTable = pgTable(
  'chats',
  {
    id: uuid().primaryKey().defaultRandom(),
    groupName: varchar('group_name', { length: 100 }),
    isGroup: boolean('is_group').default(false).notNull(),
    lastMessage: text('last_message'),
    lastMessageAt: timestamp('last_message_at'),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [index('last_message_idx').on(table.lastMessageAt)]
);

export const chatsRelation = relations(chatsTable, ({ many }) => ({
  participants: many(participantsTable),
}));
