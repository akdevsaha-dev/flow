import { jwttoken } from '@/utils/jwt';
import type { NextFunction, Request, Response } from 'express';

type Jwt_Payload = {
  id: string;
  username: string;
  email: string;
};
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const decoded = jwttoken.verify(token) as Jwt_Payload;

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
