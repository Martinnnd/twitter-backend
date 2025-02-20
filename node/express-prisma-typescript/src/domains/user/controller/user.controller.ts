import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors';

import { db } from '@utils';

import { UserRepositoryImpl } from '../repository';
import { UserService, UserServiceImpl } from '../service';
import { FollowerRepositoryImpl } from '@domains/follower/repository';

export const userRouter = Router();

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db), new FollowerRepositoryImpl(db));

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
  const { userId } = res.locals.context;
  const { limit, skip } = req.query as Record<string, string>;

  const usersView = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) });

  return res.status(HttpStatus.OK).json(usersView);
});

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
  const { userId } = res.locals.context;

  const userView = await service.getSelfUser(userId);

  return res.status(HttpStatus.OK).json(userView);
});

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
  const { userId } = req.params;
  const { userId: loggedUser } = res.locals.context;

  const user = await service.getUserView(userId, loggedUser);

  return res.status(HttpStatus.OK).json(user);
});

/**
 * @swagger
 * /api/user/by_username/{username}:
 *   get:
 *     summary: Get users by username
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the user
 *         schema:
 *           type: string
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
userRouter.get('/by_username/:username', async (req: Request, res: Response) => {
  const { username } = req.params;
  const { limit, skip } = req.query as Record<string, string>;

  const users = await service.getUsersByUsername(username, { limit: Number(limit), skip: Number(skip) });

  return res.status(HttpStatus.OK).json(users);
});

/**
 * @swagger
 * /api/user/private/:is_private:
 *   post:
 *     security:
 *       - bearer: []
 *     summary: Set user private
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: is_private
 *         schema:
 *           type: boolean
 *         required: true
 *         description: Set user private
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 private:
 *                   type: boolean
 *                   description: Privacy status
 */
userRouter.post('/private/:turnPrivate', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { turnPrivate } = req.params

  const setted = await service.setPrivate(userId, turnPrivate)
  return res.status(HttpStatus.OK).send({ private: setted })
})

/**
 * @swagger
 * /api/user:
 *   delete:
 *     security:
 *       - bearer: []
 *     summary: Delete current user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: OK
 */
userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  await service.deleteUser(userId);

  return res.status(HttpStatus.OK);
});
