import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO, ExtendedPostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (options: CursorPagination) => Promise<ExtendedPostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<ExtendedPostDTO | null>
  getByAuthorId: (authorId: string) => Promise<ExtendedPostDTO[]>
  addQtyLikes: (postId: string) => Promise<void>
  subtractQtyLikes: (postId: string) => Promise<void>
  addQtyRetweets: (postId: string) => Promise<void>
  subtractQtyRetweets: (postId: string) => Promise<void>
  addQtyComments: (postId: string) => Promise<void>
  subtractQtyComments: (postId: string) => Promise<void>
}