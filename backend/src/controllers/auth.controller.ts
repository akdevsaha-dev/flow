import { db } from '@/config/db';
import { authenticateUser, createUser } from '@/services/auth.service';
import { cookies } from '@/utils/cookie';
import { jwttoken } from '@/utils/jwt';
import { signInSchema, signUpSchema } from '@/validations/auth';
import type { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: validationResult.error.issues,
      });
    }
    const { email, username, password } = validationResult.data;

    const user = await createUser({ email, username, password });
    if (!user) return res.status(400).json({ error: 'Cannot create user' });
    const token = jwttoken.sign({
      id: user?.id,
      email: user?.email,
      username: user?.username,
    });
    cookies.set(res, 'token', token);
    return res.status(200).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        about: user.about,
      },
    });
  } catch (err: unknown) {
    let message = 'Something went wrong';
    const status = 500;

    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};
export const signin = async (req: Request, res: Response) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationResult.error,
      });
    }
    const { email, password } = validationResult.data;
    const user = await authenticateUser({ email, password });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    });
    cookies.set(res, 'token', token);
    return res.status(200).json({
      message: 'Signed in successfully.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        about: user.about,
      },
    });
  } catch (err: unknown) {
    let message = 'Something went wrong';
    const status = 500;

    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};
