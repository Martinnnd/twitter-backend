import { PrismaClient } from '@prisma/client';
import { CursorPagination } from '@types';
import { PostRepository } from '.';
import { CreatePostInputDTO, PostDTO } from '../dto';

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

  async getAllByDatePaginated(options: CursorPagination, userId: string): Promise<PostDTO[]> {
    const { after, before, limit } = options;

    const posts = await this.db.post.findMany({
      where: {
        OR: [
          // public accounts
          { author: { is_private: false } },
          // private accounts that the user follows
          { authorId: userId, author: { is_private: true } },
        ],
      },
      cursor: after ? { id: after } : before ? { id: before } : undefined,
      skip: after || before ? 1 : undefined,
      take: limit ? (before ? -limit : limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'asc',
        },
      ],
    });

    return posts.map((post) => new PostDTO(post));
  }

  async delete(postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async getById(postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
    });
    return post != null ? new PostDTO(post) : null;
  }

  async getByAuthorId(authorId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId,
      },
    });
    return posts.map((post) => new PostDTO(post));
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
