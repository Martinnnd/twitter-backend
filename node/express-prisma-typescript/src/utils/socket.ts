import { Server, Socket as IOSocket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { server } from '../server';
import { db, Constants, Logger } from '@utils';
import { MessageRepositoryImpl } from '@domains/message/repository';
import { MessageServiceImpl } from '@domains/message/service';
import { FollowerRepositoryImpl } from '@domains/follower/repository';
import { UserRepositoryImpl } from '@domains/user/repository';

interface AuthenticatedSocket extends IOSocket {
  userId?: string;
}

const messageService = new MessageServiceImpl(
  new MessageRepositoryImpl(db),
  new FollowerRepositoryImpl(db),
  new UserRepositoryImpl(db)
);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
});

io.use((socket: AuthenticatedSocket, next) => {
  const token = socket.handshake.query.token as string;

  if (!token) {
    socket.disconnect();
    return next(new Error('INVALID_TOKEN'));
  }

  jwt.verify(token, Constants.TOKEN_SECRET, (err, decoded) => {
    if (err || !decoded || typeof decoded === 'string') {
      socket.disconnect();
      return next(new Error('INVALID_TOKEN'));
    }

    socket.userId = decoded.userId;
    next();
  });
});

io.on('connection', (socket: AuthenticatedSocket) => {
  if (!socket.userId) return socket.disconnect();
  
  Logger.info(`User connected: ${socket.userId}`);

  socket.on('send_message', async ({ to, content }) => {
    if (!socket.userId) return;
    try {
      const message = await messageService.sendMessage(socket.userId, to, content);
      io.emit('new_message', message);
    } catch (error) {
      Logger.error(error);
    }
  });
});
