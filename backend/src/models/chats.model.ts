import { relations } from "drizzle-orm";
import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { participantsTable } from "./participants.model";
import { usersTable } from "./users.model";


export const chatsTable = pgTable("chats", {
    id: uuid().primaryKey().defaultRandom(),
    groupName: varchar("group_name", { length: 100 }),
    isGroup: boolean("is_group").default(false).notNull(),
    createdBy: uuid("created_by").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
})

export const chatsRelation = relations(chatsTable, ({ many }) => ({
    participants: many(participantsTable),
}))