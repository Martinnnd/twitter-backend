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

/**
 * @swagger
 * /api/comment/:post_id:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get comments by post id
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
commentRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;
  const { limit, before, after } = req.query as Record<string, string>;

  const comments = await service.getCommentsByPost(userId, postId, { limit: Number(limit), before, after });

  return res.status(httpStatus.OK).json(comments);
});


/**
 * @swagger
 * /api/comment/by_user/:user_id:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get comments by user
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
commentRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: authorId } = req.params;

  const comments = await service.getCommentsByAuthor(userId, authorId);

  return res.status(httpStatus.OK).json(comments);
});

/**
 * @swagger
 * /api/comment/:post_id:
 *   post:
 *     security:
 *       - bearer: []
 *     summary: Create comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
commentRouter.post('/:postId', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { postId } = req.params
    const data = { ...req.body, parentId: postId }
    const comment = await service.createComment(userId, data)
  
    return res.status(httpStatus.CREATED).json(comment)
  })
  
  /**
 * @swagger
 * /api/comment/:comment_id:
 *   delete:
 *     security:
 *       - bearer: []
 *     summary: Delete comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *     responses:
 *       200:
 *         description: The comment was successfully deleted
 *         content:
 *           application/json:
 *             example:
 *               message: Deleted comment {comment_id}
 */
  commentRouter.delete('/:commentId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { commentId } = req.params
  
    await service.deleteComment(userId, commentId)
  
    return res.status(httpStatus.OK).send({ message: `Deleted comment` })
  })