import { PrismaClient } from '@prisma/client';
import { CursorPagination } from '@types';
import { CommentRepository } from '.';
import { CreateCommentDto } from '../dto';
import { ExtendedPostDTO, PostDTO } from '@domains/post/dto';

export class CommentRepositoryImpl implements CommentRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, data: CreateCommentDto): Promise<PostDTO> {
    try {
      const comment = await this.db.post.create({
        data: {
          authorId: userId,
          isComment: true,
          ...data
        }
      });
      return new PostDTO(comment);
    } catch (error) {
      throw new Error('Error creating comment');
    }
  }

  async getAllByPostId(postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    try {
      const comments = await this.db.post.findMany({
        where: { isComment: true, parentId: postId },
        include: { author: true, reactions: true },
        cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
        skip: options.after ?? options.before ? 1 : undefined,
        take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
        orderBy: [ { qtyLikes: 'desc' }, { qtyRetweets: 'desc' } ]
      });
      return comments.map(comment => new ExtendedPostDTO(comment));
    } catch (error) {
      throw new Error('Error fetching comments');
    }
  }

  async delete(commentId: string): Promise<void> {
    try {
      await this.db.post.delete({ where: { id: commentId } });
    } catch (error) {
      throw new Error('Error deleting comment');
    }
  }

  async getById(commentId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({ where: { id: commentId } });
    return post ? new PostDTO(post) : null;
  }

  async getByAuthorId(authorId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({ where: { isComment: true, authorId } });
    return posts.map(post => new PostDTO(post));
  }
}
