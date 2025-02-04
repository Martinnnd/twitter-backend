import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db, BodyValidation } from '@utils'
import { ReactionRepositoryImpl } from '../repository'
import { ReactionService, ReactionServiceImpl } from '../service'
import { CreateReactionDTO } from '../dto'

export const reactionRouter = Router()

const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

reactionRouter.post('/:postId', BodyValidation(CreateReactionDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { type } = req.body

  const reaction = await service.createReaction(userId, postId, type)

  return res.status(HttpStatus.CREATED).json(reaction)
})

reactionRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await service.deleteReaction(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted reaction from post ${postId}`)
})