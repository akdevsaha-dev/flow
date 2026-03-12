import z from 'zod';

export const createChatSchema = z.object({
    participants: z.array(z.string()),
    groupName: z.string().optional(),
});
