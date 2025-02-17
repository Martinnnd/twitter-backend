// import { IsEnum, IsNotEmpty } from 'class-validator'

// enum ReactionType {
//   LIKE = 'LIKE',
//   RETWEET = 'RETWEET',
// }

// export class CreateReactionDTO {
//   @IsEnum(ReactionType)
//   @IsNotEmpty()
//   type!: ReactionType
// }

export class ReactionDTO {
  constructor(reaction: ReactionDTO) {

    this.id = reaction.id

    this.userId = reaction.userId

    this.postId = reaction.postId

    this.type = reaction.type
  }

  id: string
  userId: string
  postId: string
  type: string

}

// export interface ReactionService {
//   addReaction: (userId: string, postId: string, type: ReactionType) => Promise<ReactionDTO>
//   removeReaction: (userId: string, postId: string) => Promise<void>
// }
