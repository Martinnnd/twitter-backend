import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import 'express-async-errors';

import { db, BodyValidation } from '@utils';
import { CommentRepositoryImpl } from '../repository';
import { CommentService, CommentServiceImpl } from '../service';
import { FollowerRepositoryImpl } from '@domains/follower/repository';
import { UserRepositoryImpl } from '@domains/user/repository';
import { PostRepositoryImpl } from '@domains/post/repository';
import { CreatePostInputDTO } from '@domains/post/dto';

export const commentRouter = Router();

// Use dependency injection
const service: CommentService = new CommentServiceImpl(
  new CommentRepositoryImpl(db),
  new FollowerRepositoryImpl(db),
  new PostRepositoryImpl(db),
  new UserRepositoryImpl(db)
);


commentRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;
  const { limit, before, after } = req.query as Record<string, string>;

  const comments = await service.getCommentsByPost(userId, postId, { limit: Number(limit), before, after });

  return res.status(httpStatus.OK).json(comments);
});

commentRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: authorId } = req.params;

  const comments = await service.getCommentsByAuthor(userId, authorId);

  return res.status(httpStatus.OK).json(comments);
});

commentRouter.post('/:postId', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { postId } = req.params
    const data = { ...req.body, parentId: postId }
    const comment = await service.createComment(userId, data)
  
    return res.status(httpStatus.CREATED).json(comment)
  })
  
  commentRouter.delete('/:commentId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { commentId } = req.params
  
    await service.deleteComment(userId, commentId)
  
    return res.status(httpStatus.OK).send({ message: `Deleted comment ${commentId}` })
  })