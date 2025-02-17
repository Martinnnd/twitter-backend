// import { CreateReactionDTO } from '../dto'
import { ReactionRepository } from '../repository'
import { ReactionService } from '.'
import { ReactionDTO } from '../dto'
import { ReactionType } from '@prisma/client'
import { PostRepository } from '@domains/post/repository'
import { ValidationException } from '@utils'

export class ReactionServiceImpl implements ReactionService {
  constructor(private readonly repository: ReactionRepository, private readonly postRepository: PostRepository) {}

  async createReaction(userId: string, postId: string, type: ReactionType): Promise<ReactionDTO> {
    if( await this.reactionExists(userId, postId, type)) { throw new ValidationException([{ message: 'Reaction already exists' }]) }
    if(type === ReactionType.LIKE) await this.postRepository.addQtyLikes(postId)
    if(type === ReactionType.RETWEET) await this.postRepository.addQtyRetweets(postId)
    return await this.repository.create(userId, postId, type)

  }

  async deleteReaction(userId: string, postId: string): Promise<void> {
    await this.repository.delete(userId, postId)
  }

  async reactionExists(userId: string, postId: string, type: ReactionType): Promise<boolean> {
    const reaction = await this.repository.getByIdAndType(userId, postId, type)
    return !!reaction
  }
}