import { relations } from "drizzle-orm";
import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { participantsTable } from "./participants.model.js";


export const chatsTable = pgTable("chats", {
    id: uuid().primaryKey().defaultRandom(),
    groupName: varchar("group_name", { length: 100 }),
    isGroup: boolean("is_group").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
})

export const chatsRelation = relations(chatsTable, ({ many }) => ({
    participants: many(participantsTable),
}))