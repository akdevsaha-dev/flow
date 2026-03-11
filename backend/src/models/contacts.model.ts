import { pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core"; // All pg-core now!
import { relations } from "drizzle-orm";
import { usersTable } from "./users.model.js";

export const contactsTable = pgTable("contacts", {
    id: uuid().primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    nickName: varchar("nickname", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(), // Added defaultNow()
}, (table) => [
    unique("uniqueContact").on(table.ownerId, table.contactId)
]);

export const contactsRelations = relations(contactsTable, ({ one }) => ({
    owner: one(usersTable, {
        fields: [contactsTable.ownerId],
        references: [usersTable.id],
        relationName: "contactOwner"
    }),
    contactPerson: one(usersTable, {
        fields: [contactsTable.contactId],
        references: [usersTable.id],
        relationName: "contactPerson"
    })
}));