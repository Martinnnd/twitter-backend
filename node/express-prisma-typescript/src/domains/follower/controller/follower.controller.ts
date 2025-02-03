import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db } from '@utils'
import { FollowerRepositoryImpl } from '../repository'
import { FollowerService, FollowerServiceImpl } from '../service'

export const followerRouter = Router()

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))

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
  const { userId } = res.locals.context
  const { userId: targetUserId } = req.params

  // Llamada al servicio para seguir al usuario
  const result = await service.followUser(userId, targetUserId)

  if (!result) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found or already following' })
  }

  return res.status(HttpStatus.OK).json({ message: 'Followed successfully' })
})

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
  const { userId } = res.locals.context
  const { userId: targetUserId } = req.params

  // Llamada al servicio para dejar de seguir al usuario
  const result = await service.unfollowUser(userId, targetUserId)

  if (!result) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found or not following' })
  }

  return res.status(HttpStatus.OK).json({ message: 'Unfollowed successfully' })
})
