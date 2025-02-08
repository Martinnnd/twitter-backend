import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db, BodyValidation } from '@utils'
import { ReactionRepositoryImpl } from '../repository'
import { ReactionService, ReactionServiceImpl } from '../service'
import { CreateReactionDTO } from '../dto'

export const reactionRouter = Router()

const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

/**
 * @swagger
 * /api/reaction/{postId}:
 *   post:
 *     security:
 *       - bearer: []
 *     summary: Create a reaction
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to react
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReactionDTO'
 *     responses:
 *       201:
 *         description: Created reaction
 *       400:
 *         description: Invalid request body
 */
reactionRouter.post('/:postId', BodyValidation(CreateReactionDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { type } = req.body

  const reaction = await service.createReaction(userId, postId, type)

  return res.status(HttpStatus.CREATED).json(reaction)
})

/**
 * @swagger
 * /api/reaction/{postId}:
 *   delete:
 *     security:
 *       - bearer: []
 *     summary: Delete a reaction
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to delete reaction
 *     responses:
 *       200:
 *         description: Deleted reaction
 */
reactionRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await service.deleteReaction(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted reaction from post ${postId}`)
})