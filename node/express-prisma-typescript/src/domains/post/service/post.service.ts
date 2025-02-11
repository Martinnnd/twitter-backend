import { CreatePostInputDTO, PostDTO } from '../dto'
import { ExtendedPostDTO } from '../dto'

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>
  deletePost: (userId: string, postId: string) => Promise<void>
  getPost: (userId: string, postId: string) => Promise<ExtendedPostDTO>
  getLatestPosts: (
    userId: string,
    options: { limit?: number, before?: string, after?: string }
  ) => Promise<ExtendedPostDTO[]>
  getLatestPostsFollowing: (
    userId: string,
    options: { limit?: number, before?: string, after?: string }
  ) => Promise<ExtendedPostDTO[]>
  getPostsByAuthor: (userId: any, authorId: string) => Promise<ExtendedPostDTO[]>
  setPostImage(filetype: string): Promise<{ presignedUrl: string, fileUrl: string}>
  addQtyLikes: (postId: string) => Promise<void>
  subtractQtyLikes: (postId: string) => Promise<void>
  addQtyComments: (postId: string) => Promise<void>
  subtractQtyComments: (postId: string) => Promise<void>
  addQtyRetweets: (postId: string) => Promise<void>
  subtractQtyRetweets: (postId: string) => Promise<void>
}