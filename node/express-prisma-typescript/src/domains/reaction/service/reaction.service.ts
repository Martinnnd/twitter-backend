import { CreateReactionDTO } from '../dto'
import { ReactionDTO } from '../dto'

export interface ReactionService {
  createReaction: (userId: string, postId: string, type: CreateReactionDTO) => Promise<ReactionDTO>
  deleteReaction: (userId: string, postId: string) => Promise<void>
}