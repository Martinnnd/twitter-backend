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

const service: CommentService = new CommentServiceImpl(
  new CommentRepositoryImpl(db),
  new FollowerRepositoryImpl(db),
  new PostRepositoryImpl(db),
  new UserRepositoryImpl(db)
);

/**
 * @swagger
 * /api/comment/{postId}:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get comments by post ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
commentRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;
  const { limit = '10', before, after } = req.query as Record<string, string>;

  if (!postId) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Post ID is required' });
  }

  const comments = await service.getCommentsByPost(userId, postId, {
    limit: Number(limit),
    before,
    after,
  });

  return res.status(httpStatus.OK).json(comments);
});

/**
 * @swagger
 * /api/comment/by_user/{userId}:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get comments by a specific user
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID whose comments to retrieve
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
commentRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: authorId } = req.params;

  if (!authorId) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
  }

  const comments = await service.getCommentsByAuthor(userId, authorId);
  return res.status(httpStatus.OK).json(comments);
});

/**
 * @swagger
 * /api/comment/{postId}:
 *   post:
 *     security:
 *       - bearer: []
 *     summary: Create a new comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInputDTO'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
commentRouter.post('/:postId', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;

  if (!postId) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Post ID is required' });
  }

  const data = { ...req.body, parentId: postId };
  const comment = await service.createComment(userId, data);

  return res.status(httpStatus.CREATED).json(comment);
});

/**
 * @swagger
 * /api/comment/{commentId}:
 *   delete:
 *     security:
 *       - bearer: []
 *     summary: Delete a comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID to delete
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
commentRouter.delete('/:commentId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { commentId } = req.params;

  if (!commentId) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Comment ID is required' });
  }

  await service.deleteComment(userId, commentId);
  return res.status(httpStatus.OK).json({ message: 'Deleted comment successfully' });
});