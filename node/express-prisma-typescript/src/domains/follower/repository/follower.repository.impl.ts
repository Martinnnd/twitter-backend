import { PrismaClient } from '@prisma/client'
import { FollowerRepository } from './'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}

  async follow(userId: string, targetUserId: string): Promise<boolean> {
    // verify if already following
    const alreadyFollowing = await this.db.follow.findFirst({
      where: {
        followerId: userId,
        followedId: targetUserId
      }
    })

    if (alreadyFollowing) {
      return false  // already following
    }

    await this.db.follow.create({
      data: {
        followerId: userId,
        followedId: targetUserId
      }
    })

    return true 
  }

  async unfollow(userId: string, targetUserId: string): Promise<boolean> {
    // search for the follow relationship
    const follow = await this.db.follow.findFirst({
      where: {
        followerId: userId,
        followedId: targetUserId
      }
    })

    if (!follow) {
      return false // not following
    }

    // eliminate the follow relationship
    await this.db.follow.delete({
      where: {
        id: follow.id
      }
    })

    return true
  }
}
