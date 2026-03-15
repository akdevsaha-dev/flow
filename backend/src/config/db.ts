import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as usersModel from '@/models/users.model';
import * as chatsModel from '@/models/chats.model';
import * as messagesModel from '@/models/message.model';
import * as participantsModel from '@/models/participants.model';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ 
  client: pool,
  schema: {
    ...usersModel,
    ...chatsModel,
    ...messagesModel,
    ...participantsModel,
  }
});
