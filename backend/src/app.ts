import express, { type Request, type Response } from 'express';
import http from 'http';
import cors from 'cors';
import { authRoute } from './routes/auth.route';
import { chatRoute } from './routes/chat.route';
import cookieParser from 'cookie-parser';
import { contactRoute } from './routes/contact.route';
import { userRoute } from './routes/user.route';
import { attachWebSocketServer } from './server/ws/server';

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';
const app = express();
const server = http.createServer(app);

attachWebSocketServer(server);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Initial setup feel free to change me');
});
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/contact', contactRoute);
console.log('Backend starting...');
server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running on ${baseUrl}`);
  console.log(
    `WebSocket server is running on ${baseUrl.replace('http', 'ws')}/ws`
  );
});
