import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

/**
 * @swagger
 * /api/user:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get user recommendations
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: The number of users to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         required: false
 *         description: The number of users to skip
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response) => {
  // const { userId } = res.locals.context
  // const { limit, skip } = req.query as Record<string, string>

  // const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  // return res.status(HttpStatus.OK).json(users)
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const usersView = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(usersView)  
})

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get current user data
 *     tags: [User]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  // const user = await service.getUser(userId)

  // return res.status(HttpStatus.OK).json(user)
  const userView = await service.getUser(userId)

  return res.status(HttpStatus.OK).json(userView) 
})

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params

  const user = await service.getUser(otherUserId)

  return res.status(HttpStatus.OK).json(user)
})


userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})
