import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import 'express-async-errors';

import { db } from '@utils';
import { FollowerRepositoryImpl } from '../repository';
import { FollowerService, FollowerServiceImpl } from '../service';
import { UserRepositoryImpl } from '@domains/user/repository';

export const followerRouter = Router();

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db), new UserRepositoryImpl(db));

/**
 * @swagger
 * /api/follower/follow/{userId}:
 *   post:
 *     security:
 *       - bearer: []
 *     summary: Follow a user
 *     tags: [Follower]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to follow
 *     responses:
 *       200:
 *         description: Followed successfully
 *       404:
 *         description: User not found or already following
 */
followerRouter.post('/follow/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: targetUserId } = req.params;

  if (!targetUserId) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
  }

  const result = await service.followUser(userId, targetUserId);

  if (!result) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found or already following' });
  }

  return res.status(HttpStatus.OK).json({ message: 'Followed successfully' });
});

/**
 * @swagger
 * /api/follower/unfollow/{userId}:
 *   post:
 *     security:
 *       - bearer: []
 *     summary: Unfollow a user
 *     tags: [Follower]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to unfollow
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 *       404:
 *         description: User not found or not following
 */
followerRouter.post('/unfollow/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: targetUserId } = req.params;

  // Llamada al servicio para dejar de seguir al usuario
  const result = await service.unfollowUser(userId, targetUserId);

  if (!result) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found or not following' });
  }

  return res.status(HttpStatus.OK).json({ message: 'Unfollowed successfully' });
});

// followerRouter.get('/doesFollow/:user_id', async (req: Request, res: Response) => {
//   const { userId } = res.locals.context
//   const { user_id: targetUserId } = req.params

//   const doesFollow = await service.doesFollow(userId, targetUserId)

//   return res.status(HttpStatus.OK).json({ message: result })
// }

/**
 * @swagger
 * /api/follower/followers/{userId}:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get a list of followers
 *     tags: [Follower]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to get the followers from
 *     responses:
 *       200:
 *         description: A list of followers
 */
followerRouter.get('/followers/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  const followers = await service.getFollowers(userId);

  return res.status(HttpStatus.OK).json(followers);
});

/**
 * @swagger
 * /api/follower/followings/{userId}:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get a list of followings
 *     tags: [Follower]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to get the followings from
 *     responses:
 *       200:
 *         description: A list of followings
 */
followerRouter.get('/followings/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  const followings = await service.getFollowings(userId);

  return res.status(HttpStatus.OK).json(followings);
});

/**
 * @swagger
 * /api/follower/mutual:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get a list of mutual followers
 *     tags: [Follower]
 *     responses:
 *       200:
 *         description: A list of mutual followers
 */
followerRouter.get('/mutual', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const mutuals = await service.getMutuals(userId)

  return res.status(HttpStatus.OK).json(mutuals)
}); 


