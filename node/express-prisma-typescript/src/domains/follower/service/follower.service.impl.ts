import { FollowerService } from './follower.service'
import { FollowerRepository } from '../repository'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}

  async followUser(userId: string, targetUserId: string): Promise<boolean> {
    return this.repository.follow(userId, targetUserId)
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<boolean> {
    return this.repository.unfollow(userId, targetUserId)
  }
}
