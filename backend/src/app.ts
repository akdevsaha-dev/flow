import express, { type Request, type Response } from 'express';
import http from 'http';
import { authRoute } from './routes/auth.route';
import { chatRoute } from './routes/chat.route';
import cookieParser from 'cookie-parser';
import { contactRoute } from './routes/contact.route';
import { attachWebsockerServer } from './server/ws/server';
const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || '0.0.0.0';
const app = express();
const server = http.createServer(app);
attachWebsockerServer(server);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Initial setup feel free to change me');
});
app.use('/api/auth', authRoute);
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
