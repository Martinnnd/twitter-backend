import { PrismaClient } from '@prisma/client'
import { FollowerRepository } from '.'
import { FollowerDto } from '../dto'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}

  async follow(userId: string, targetUserId: string): Promise<FollowerDto> {

    if (!uuidValidate(userId) || !uuidValidate(targetUserId)) {
      throw new Error('User not found');
    }

    if (userId === targetUserId) {
      throw new Error('You cannot follow yourself');
    }
    // verify if already following
    const alreadyFollowing = await this.db.follow.findFirst({
      where: {
        followerId: userId,
        followedId: targetUserId
      }
    })

    if (alreadyFollowing) {
      throw new Error('User is already following') // already following
    }

    const follow = await this.db.follow.create({
      data: {
        followerId: userId,
        followedId: targetUserId
      }
    })

    return new FollowerDto(follow) 
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

  async getByIds (followerId: string, followedId: string): Promise<FollowerDto | null>{
    const follow = await this.db.follow.findFirst({
      where: {
        followerId,
        followedId
      }
    })

    return follow != null ? new FollowerDto(follow) : null
  }

  async getFollowers (userId: string): Promise<FollowerDto[]> {
    const followers = await this.db.follow.findMany({
      where: {
        
        followedId: userId
      }
    })

    return followers.map(follower => new FollowerDto(follower))
  }

  async getFollowings (userId: string): Promise<FollowerDto[]> {
    const follows = await this.db.follow.findMany({
      where: {
        followerId: userId
      }
    })

    return follows.map(follow => new FollowerDto(follow))
  }
}
