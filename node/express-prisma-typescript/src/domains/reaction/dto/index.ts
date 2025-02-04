import { IsEnum, IsNotEmpty } from 'class-validator'

enum ReactionType {
  LIKE = 'LIKE',
  RETWEET = 'RETWEET',
}

export class CreateReactionDTO {
  @IsEnum(ReactionType)
  @IsNotEmpty()
  type!: ReactionType
}

export class ReactionDTO {
  id: string
  userId: string
  postId: string
  type: ReactionType

  constructor(reaction: { id: string, userId: string, postId: string, type: string }) {

    this.id = reaction.id

    this.userId = reaction.userId

    this.postId = reaction.postId

    this.type = reaction.type as ReactionType

  }
}

export interface ReactionService {
  addReaction: (userId: string, postId: string, type: ReactionType) => Promise<ReactionDTO>
  removeReaction: (userId: string, postId: string) => Promise<void>
}
