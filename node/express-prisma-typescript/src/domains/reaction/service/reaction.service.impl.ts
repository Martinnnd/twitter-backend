import { CreateReactionDTO } from '../dto'
import { ReactionRepository } from '../repository'
import { ReactionService } from '.'
import { ReactionDTO } from '../dto'

export class ReactionServiceImpl implements ReactionService {
  constructor(private readonly repository: ReactionRepository) {}

  async createReaction(userId: string, postId: string, data: CreateReactionDTO): Promise<ReactionDTO> {
    return await this.repository.create(userId, postId, data)
  }

  async deleteReaction(userId: string, postId: string): Promise<void> {
    await this.repository.delete(userId, postId)
  }
}