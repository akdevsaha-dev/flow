import { boolean, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users.model.js";
import { chatsTable } from "./chats.model.js";
import { relations } from "drizzle-orm";

export const participantsTable = pgTable("participants", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    chatId: uuid("chat_id").notNull().references(() => chatsTable.id, { onDelete: "cascade" }),
    isAdmin: boolean("is_admin").default(false).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => [
    unique("uniqueMembership").on(table.userId, table.chatId)
]);

export const participantsRelation = relations(participantsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [participantsTable.userId],
        references: [usersTable.id]
    }),
    chat: one(chatsTable, {
        fields: [participantsTable.chatId],
        references: [chatsTable.id]
    })
}));