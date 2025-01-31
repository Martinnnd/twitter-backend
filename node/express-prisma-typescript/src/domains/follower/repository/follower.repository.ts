import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FollowerRepository {
  async followUser(followerId: string, followedId: string) {
    return prisma.follow.create({
      data: {
        followerId,
        followedId,
      },
    });
  }

  async unfollowUser(followerId: string, followedId: string) {
    return prisma.follow.deleteMany({
      where: {
        followerId,
        followedId,
      },
    });
  }
}