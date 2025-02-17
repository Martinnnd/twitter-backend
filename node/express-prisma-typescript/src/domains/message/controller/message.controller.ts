import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import 'express-async-errors';
import { db } from '@utils';
import { MessageRepositoryImpl } from '../repository';
import { MessageService, MessageServiceImpl } from '../service';
import { FollowerRepositoryImpl } from '@domains/follower/repository';
import { UserRepositoryImpl } from '@domains/user/repository';

export const messageRouter = Router();

const service: MessageService = new MessageServiceImpl(
  new MessageRepositoryImpl(db),
  new FollowerRepositoryImpl(db),
  new UserRepositoryImpl(db)
);

messageRouter.post('/send/:receiverId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { receiverId } = req.params;
  const { content } = req.body;

  try {
    const message = await service.sendMessage(userId, receiverId, content);
    return res.status(HttpStatus.CREATED).json(message);
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: (error as Error).message });
  }
});

messageRouter.get('/conversation/:otherUserId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { otherUserId } = req.params;

  try {
    const messages = await service.getConversation(userId, otherUserId);
    return res.status(HttpStatus.OK).json(messages);
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: (error as Error).message });
  }
});

messageRouter.get('/conversations', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  try {
    const conversations = await service.getAllChats(userId);
    return res.status(HttpStatus.OK).json(conversations);
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: (error as Error).message });
  }
});
