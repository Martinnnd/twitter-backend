import { PrismaClient, ReactionType } from '@prisma/client';
import { ReactionRepository } from './reaction.repository';
// import { CreateReactionDTO } from '../dto';
import { ReactionDTO } from '../dto';

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, postId: string, type: ReactionType): Promise<ReactionDTO> {
    const reaction = await this.db.reaction.create({
      data: { userId, postId, type },
    });
    return new ReactionDTO(reaction);
  }

  async delete(userId: string, postId: string): Promise<void> {
    await this.db.reaction.deleteMany({
      where: { userId, postId },
    });
  }

  async getByIdAndType (userId: string, postId: string, type: ReactionType): Promise<ReactionDTO | null> {
    const reaction = await this.db.reaction.findFirst({
      where: { userId, postId, type },
    });
    return reaction ? new ReactionDTO(reaction) : null;
  }
}
