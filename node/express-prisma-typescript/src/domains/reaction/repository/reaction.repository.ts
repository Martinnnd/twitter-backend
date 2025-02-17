import { ReactionType } from '@prisma/client'
// import { CreateReactionDTO } from '../dto'
import { ReactionDTO } from '../dto'

export interface ReactionRepository {
  create(userId: string, postId: string, type: ReactionType): Promise<ReactionDTO>
  delete: (userId: string, postId: string) => Promise<void>
  getByIdAndType (userId: string, postId: string, type: ReactionType): Promise<ReactionDTO | null>
}