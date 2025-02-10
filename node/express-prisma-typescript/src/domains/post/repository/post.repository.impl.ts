import { PrismaClient } from '@prisma/client';
import { CursorPagination } from '@types';
import { PostRepository } from '.';
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto';

export class PostRepositoryImpl implements PostRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data,
      },
    });
    return new PostDTO(post);
  }

  async getAllByDatePaginated (options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      where: {
        parentId: null,
        isComment: false
      },
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ],
      include: {
        author: true,
        reactions: true
      }
    })
    return posts.map((post) => new ExtendedPostDTO(post))
  }

  async delete(postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async getById (postId: string): Promise<ExtendedPostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: true,
        reactions: true
      }
    })
    return post != null ? new ExtendedPostDTO(post) : null
  }

  async getByAuthorId (authorId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId
      },
      include: {
        author: true,
        reactions: true
      }
    })
    return posts.map((post) => new ExtendedPostDTO(post))
  }

  async addQtyLikes(postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        qtyLikes: {
          increment: 1,
        },
      },
    });
  }

  async subtractQtyLikes(postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        qtyLikes: {
          decrement: 1,
        },
      },
    });
  }

  async addQtyRetweets(postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        qtyRetweets: {
          increment: 1,
        },
      },
    });
  }

  async subtractQtyRetweets(postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        qtyRetweets: {
          decrement: 1,
        },
      },
    });
  }

  async addQtyComments(postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        qtyComments: {
          increment: 1,
        },
      },
    });
  }

  async subtractQtyComments(postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        qtyComments: {
          decrement: 1,
        },
      },
    });
  }
}
