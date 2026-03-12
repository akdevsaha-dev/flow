import express, { type Request, type Response } from 'express';
import { authRoute } from './routes/auth.route';
import { chatRoute } from './routes/chat.route';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/', (req: Request, res: Response) => {
  res.send('Initial setup feel free to change me');
});
app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);
export default app;
