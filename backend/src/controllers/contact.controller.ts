import {
  findContacts,
  saveContact,
  updateNickname,
  toggleBlockContact,
} from '@/services/contact.service';
import {
  addContactSchemaValidation,
  updateNicknameSchema,
  toggleBlockSchema,
} from '@/validations/contact.val';
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
    return res.status(200).json({ contacts: contacts });
  } catch (err) {
    let message = 'Something went wrong';
    let status = 500;
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};

export const updateNicknameHandler = async (req: Request, res: Response) => {
  try {
    const validationResult = updateNicknameSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: validationResult.error });
    }
    const { contactId, nickName } = validationResult.data;
    const ownerId = req.user.id;
    const updated = await updateNickname({ ownerId, contactId, nickName });
    return res
      .status(200)
      .json({ message: 'Nickname updated successfully', contact: updated });
  } catch (err) {
    return res
      .status(500)
      .json({
        error: err instanceof Error ? err.message : 'Something went wrong',
      });
  }
};

export const blockContactHandler = async (req: Request, res: Response) => {
  try {
    const validationResult = toggleBlockSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: validationResult.error });
    }
    const { contactId, isBlocked } = validationResult.data;
    const ownerId = req.user.id;
    const updated = await toggleBlockContact({ ownerId, contactId, isBlocked });
    return res
      .status(200)
      .json({
        message: `Contact ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
        contact: updated,
      });
  } catch (err) {
    return res
      .status(500)
      .json({
        error: err instanceof Error ? err.message : 'Something went wrong',
      });
  }
};
