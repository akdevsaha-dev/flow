import { db } from '@/config/db';
import { usersTable } from '@/models/users.model';
import { and, eq, ilike, ne, or } from 'drizzle-orm';

export async function searchUsers(query: string, excludeUserId: string) {
  const users = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      avatarUrl: usersTable.avatarUrl,
      about: usersTable.about,
    })
    .from(usersTable)
    .where(
      and(
        ne(usersTable.id, excludeUserId),
        or(
          ilike(usersTable.username, `%${query}%`),
          ilike(usersTable.email, `%${query}%`)
        )
      )
    )
    .limit(20);

  return users;
}

export async function updateUser(userId: string, data: { username?: string; avatarUrl?: string; about?: string }) {
  const [updatedUser] = await db
    .update(usersTable)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, userId))
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      avatarUrl: usersTable.avatarUrl,
      about: usersTable.about,
    });

  return updatedUser;
}

export async function getUserById(userId: string) {
  const [user] = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      avatarUrl: usersTable.avatarUrl,
      about: usersTable.about,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  return user;
}
