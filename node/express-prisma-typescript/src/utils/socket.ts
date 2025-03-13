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
    origin: '*', // Especificar dominio permitido
    methods: ['GET', 'POST'],
  },
});

// Middleware para autenticar usuarios con token
io.use((socket: AuthenticatedSocket, next) => {
  const token = socket.handshake.query.token as string;

  if (!token) {
    Logger.warn('Socket connection rejected: No token provided.');
    socket.emit('error', { message: 'Authentication failed: No token provided' });
    return next(new Error('INVALID_TOKEN'));
  }

  jwt.verify(token, Constants.TOKEN_SECRET, (err, decoded) => {
    if (err || !decoded || typeof decoded !== 'object') {
      Logger.warn('Socket connection rejected: Invalid token');
      socket.emit('error', { message: 'Authentication failed: Invalid token' });
      return next(new Error('INVALID_TOKEN'));
    }

    socket.userId = decoded.userId;
    next();
  });
});

io.on('connection', (socket: AuthenticatedSocket) => {
  if (!socket.userId) {
    Logger.warn('Socket connection rejected: No userId found after authentication');
    socket.emit('error', { message: 'Authentication failed: No user ID' });
    return socket.disconnect();
  }

  Logger.info(`User connected: ${socket.userId}`);
  socket.join(socket.userId); 

  // Manejo del evento "send_message"
  socket.on('send_message', async ({ to, content }) => {
    if (!socket.userId) {
      return socket.emit('error', { message: 'Not authenticated' });
    }
    if (!to || !content || typeof to !== 'string' || typeof content !== 'string') {
      return socket.emit('error', { message: 'Invalid message format' });
    }

    try {
      // Verificar si el usuario sigue al destinatario
      const canSendMessage = await messageService.canSendMessage(socket.userId, to);
      if (!canSendMessage) {
        return socket.emit('error', { message: 'You cannot message this user' });
      }

      // Guardar el mensaje y enviarlo a los clientes
      const message = await messageService.sendMessage(socket.userId, to, content);
      io.to(to).emit('new_message', message);
      io.to(socket.userId).emit('new_message', message);
    } catch (error) {
      Logger.error(`Error sending message: ${error}`);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Manejo de desconexión
  socket.on('disconnect', () => {
    Logger.info(`User disconnected: ${socket.userId}`);
  });
});

