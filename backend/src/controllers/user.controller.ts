import { searchUsers, updateUser } from '@/services/user.service';
import { jwttoken } from '@/utils/jwt';
import { cookies } from '@/utils/cookie';
import type { Request, Response } from 'express';

export async function searchUsersHandler(req: Request, res: Response) {
  try {
    const query = req.query.query as string;
    if (!query) return res.status(200).json({ users: [] });

    const excludeUserId = req.user.id;
    const users = await searchUsers(query, excludeUserId);
    return res.status(200).json({ users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return res.status(500).json({ error: message });
  }
}

export async function updateProfileHandler(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const { username, about, avatarUrl } = req.body;

    if (username && (username.length < 3 || username.length > 60)) {
      return res.status(400).json({ error: 'Username must be between 3 and 60 characters' });
    }

    const updatedUser = await updateUser(userId, {
      username,
      about,
      avatarUrl,
    });

    // Refresh token with new info
    const token = jwttoken.sign({
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    cookies.set(res, 'token', token);

    return res.status(200).json({ user: updatedUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return res.status(500).json({ error: message });
  }
}
