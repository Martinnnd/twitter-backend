import { CreateReactionDTO } from '../dto'
import { ReactionDTO } from '../dto'

export interface ReactionRepository {
  create: (userId: string, postId: string, data: CreateReactionDTO) => Promise<ReactionDTO>
  delete: (userId: string, postId: string) => Promise<void>
}