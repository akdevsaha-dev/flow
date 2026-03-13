import z from 'zod';

export const addContactSchemaValidation = z.object({
  contactId: z.string(),
  nickName: z.string().optional(),
});
