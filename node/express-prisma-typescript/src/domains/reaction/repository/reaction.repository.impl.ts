import { PrismaClient } from '@prisma/client'
import { ReactionRepository } from './reaction.repository'
import { CreateReactionDTO } from '../dto'
import { ReactionDTO } from '../dto'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, postId: string, data: CreateReactionDTO): Promise<ReactionDTO> {
    const reaction = await this.db.reaction.create({
      data: { userId, postId, type: data.type }
    })
    return new ReactionDTO(reaction)
  }

  async delete(userId: string, postId: string): Promise<void> {
    await this.db.reaction.deleteMany({
      where: { userId, postId }
    })
  }
}