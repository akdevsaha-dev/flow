import z from 'zod';

export const signUpSchema = z.object({
  email: z.email().toLowerCase().trim(),
  username: z.string().min(2).max(30),
  password: z.string().min(6).max(80),
});

export const signInSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(6).max(80),
});
