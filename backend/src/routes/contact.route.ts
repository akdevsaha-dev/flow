import { addContact, getContacts } from '@/controllers/contact.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth.middleware';

export const contactRoute = Router();

contactRoute.post('/add-contact', authMiddleware, addContact);
contactRoute.get('/get-contacts', authMiddleware, getContacts);
