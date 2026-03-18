import { checkAuth, signin, signout, signup } from '@/controllers/auth.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { Router } from 'express';

export const authRoute = Router();

authRoute.post('/signup', signup);
authRoute.post('/signin', signin);
authRoute.post('/signout', signout);
authRoute.get('/check-auth', authMiddleware, checkAuth);
