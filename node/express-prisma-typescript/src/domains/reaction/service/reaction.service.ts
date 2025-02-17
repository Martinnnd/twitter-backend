import { ReactionType } from '@prisma/client'
// import { CreateReactionDTO } from '../dto'
import { ReactionDTO } from '../dto'

export interface ReactionService {
  createReaction(userId: string, postId: string, type: ReactionType): Promise<ReactionDTO>
  deleteReaction: (userId: string, postId: string) => Promise<void>
  reactionExists(userId: string, postId: string, type: ReactionType): Promise<boolean>
}