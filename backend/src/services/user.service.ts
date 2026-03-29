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
