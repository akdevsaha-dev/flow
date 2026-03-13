import { findContacts, saveContact } from '@/services/contact.service';
import { addContactSchemaValidation } from '@/validations/contact.val';
import type { Request, Response } from 'express';

export const addContact = async (req: Request, res: Response) => {
  try {
    const validationResult = addContactSchemaValidation.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error,
      });
    }
    const { contactId, nickName } = validationResult.data;
    const ownerId = req.user.id;
    const contact = await saveContact({ contactId, ownerId, nickName });
    return res
      .status(200)
      .json({ message: 'Contact added successfully', contact: contact });
  } catch (err) {
    let message = 'Something went wrong';
    let status = 500;
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user.id;
    const contacts = await findContacts({ ownerId });
    return res.status(200).json({ contacts: contacts })
  } catch (err) {
    let message = 'Something went wrong';
    let status = 500;
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};
