import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'
import { UserRepositoryImpl } from '@domains/user/repository'

import { AuthService, AuthServiceImpl } from '../service'
import { LoginInputDTO, SignupInputDTO } from '../dto'

export const authRouter = Router()

// Use dependency injection
const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db))

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInputDTO'
 *     responses:
 *       201:
 *         description: User successfully signed up
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: The generated token
 *       400:
 *         description: Invalid input
 */
authRouter.post('/signup', BodyValidation(SignupInputDTO), async (req: Request, res: Response) => {
  const data = req.body

  const token = await service.signup(data)

  return res.status(HttpStatus.CREATED).json(token)
})

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInputDTO'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: The generated token
 *       400:
 *         description: Invalid credentials
 */
authRouter.post('/login', BodyValidation(LoginInputDTO), async (req: Request, res: Response) => {
  const data = req.body

  const token = await service.login(data)

  return res.status(HttpStatus.OK).json(token)
})

/**
 * @swagger
 * /api/auth/validateToken:
 *   post:
 *     summary: Validate token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token to validate
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 validToken:
 *                   type: boolean
 *                   description: Indicates if the token is valid
 */
authRouter.post('/validateToken', async (req: Request, res: Response) => {
  const { token } = req.body

  const validToken = service.validateToken(token)

  return res.status(HttpStatus.OK).json(validToken)
})