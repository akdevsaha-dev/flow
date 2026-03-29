import { searchUsers } from '@/services/user.service';
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
