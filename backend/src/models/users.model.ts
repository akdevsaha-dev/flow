import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { participantsTable } from './participants.model';
import { messagesTable } from './message.model';

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    username: varchar({ length: 60 }).notNull(),
    email: varchar({ length: 80 }).notNull().unique(),
    password: varchar({ length: 80 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    about: text().default("Hey there! I am using flow."),
    avatarUrl: text('avatar_url'),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    deletedAt: timestamp("deleted_at")
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  participants: many(participantsTable),
  messages: many(messagesTable),
}));
