import z from 'zod';

export const addContactSchemaValidation = z.object({
  contactId: z.string(),
  nickName: z.string().optional(),
});

export const updateNicknameSchema = z.object({
  contactId: z.string(),
  nickName: z.string().min(1, "Nickname cannot be empty"),
});

export const toggleBlockSchema = z.object({
  contactId: z.string(),
  isBlocked: z.boolean(),
});
