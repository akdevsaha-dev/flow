import { db } from '@/config/db';
import { contactsTable } from '@/models/contacts.model';
import { usersTable } from '@/models/users.model';
import type { findContactsProps, saveContactProps } from '@/types';
import { and, eq } from 'drizzle-orm';

export const saveContact = async ({
  ownerId,
  contactId,
  nickName,
}: saveContactProps) => {
  const existingContact = await db
    .select()
    .from(contactsTable)
    .where(
      and(
        eq(contactsTable.ownerId, ownerId),
        eq(contactsTable.contactId, contactId)
      )
    );
  if (existingContact.length > 0) {
    throw new Error('Contact already exists');
  }
  const [newContact] = await db
    .insert(contactsTable)
    .values({
      ownerId,
      contactId,
      nickName,
    })
    .returning();
  return newContact;
};

export const findContacts = async ({ ownerId }: findContactsProps) => {
  const contacts = await db
    .select({
      id: usersTable.id,
      nickName: contactsTable.nickName,
      username: usersTable.username,
      email: usersTable.email,
      avatar: usersTable.avatarUrl,
      isBlocked: contactsTable.isBlocked,
    })
    .from(contactsTable)
    .innerJoin(usersTable, eq(contactsTable.contactId, usersTable.id))
    .where(eq(contactsTable.ownerId, ownerId));

  return contacts.map(c => ({
    id: c.id,
    name: c.nickName || c.username,
    username: c.username,
    email: c.email,
    avatar: c.avatar,
    isBlocked: c.isBlocked,
  }));
};

export const updateNickname = async ({ ownerId, contactId, nickName }: { ownerId: string, contactId: string, nickName: string }) => {
  await db.insert(contactsTable)
    .values({ ownerId, contactId, nickName })
    .onConflictDoUpdate({
      target: [contactsTable.ownerId, contactsTable.contactId],
      set: { nickName }
    });

  const [contact] = await db
    .select({
      id: usersTable.id,
      nickName: contactsTable.nickName,
      username: usersTable.username,
      email: usersTable.email,
      avatar: usersTable.avatarUrl,
      isBlocked: contactsTable.isBlocked,
    })
    .from(contactsTable)
    .innerJoin(usersTable, eq(contactsTable.contactId, usersTable.id))
    .where(and(eq(contactsTable.ownerId, ownerId), eq(contactsTable.contactId, contactId)));

  return contact ? {
    id: contact.id,
    name: contact.nickName || contact.username,
    username: contact.username,
    email: contact.email,
    avatar: contact.avatar,
    isBlocked: contact.isBlocked,
  } : null;
};

export const toggleBlockContact = async ({ ownerId, contactId, isBlocked }: { ownerId: string, contactId: string, isBlocked: boolean }) => {
  await db.insert(contactsTable)
    .values({ ownerId, contactId, isBlocked })
    .onConflictDoUpdate({
      target: [contactsTable.ownerId, contactsTable.contactId],
      set: { isBlocked }
    });

  const [contact] = await db
    .select({
      id: usersTable.id,
      nickName: contactsTable.nickName,
      username: usersTable.username,
      email: usersTable.email,
      avatar: usersTable.avatarUrl,
      isBlocked: contactsTable.isBlocked,
    })
    .from(contactsTable)
    .innerJoin(usersTable, eq(contactsTable.contactId, usersTable.id))
    .where(and(eq(contactsTable.ownerId, ownerId), eq(contactsTable.contactId, contactId)));

  return contact ? {
    id: contact.id,
    name: contact.nickName || contact.username,
    username: contact.username,
    email: contact.email,
    avatar: contact.avatar,
    isBlocked: contact.isBlocked,
  } : null;
};
