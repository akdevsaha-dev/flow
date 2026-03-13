import { db } from '@/config/db';
import { usersTable } from '@/models/users.model';
import type { authenticateUserProps, createUserProps } from '@/types';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';



export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error verifying password');
  }
};

export const createUser = async ({
  email,
  password,
  username,
}: createUserProps) => {
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  if (existingUser) throw new Error('User already exists');
  const passwordHash = await hashPassword(password);
  const [newUser] = await db
    .insert(usersTable)
    .values({ email, username, password: passwordHash })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      createdAt: usersTable.createdAt,
      about: usersTable.about,
    });

  return newUser;
};

export const authenticateUser = async ({
  email,
  password,
}: authenticateUserProps) => {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      password: usersTable.password,
      about: usersTable.about,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!existingUser) throw new Error('User not found.');
  const isPasswordValid = await comparePassword(
    password,
    existingUser.password
  );
  if (!isPasswordValid) throw new Error('Incorrect password');
  const { password: _, ...safeUser } = existingUser;

  return safeUser;
};
