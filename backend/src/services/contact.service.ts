import { db } from '@/config/db';
import { contactsTable } from '@/models/contacts.model';
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
    .select()
    .from(contactsTable)
    .where(eq(contactsTable.ownerId, ownerId));
  return contacts;
};
