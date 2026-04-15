import { searchUsersHandler, updateProfileHandler } from '@/controllers/user.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { Router } from 'express';

export const userRoute = Router();

userRoute.get('/search', authMiddleware, searchUsersHandler);
userRoute.patch('/profile', authMiddleware, updateProfileHandler);
