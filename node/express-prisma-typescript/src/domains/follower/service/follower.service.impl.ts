import { FollowerService } from './follower.service'
import { FollowerRepository } from '../repository'
import { UserRepository } from '@domains/user/repository'
import { FollowerDto } from '../dto'
import { NotFoundException } from '@utils'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository, private readonly userRepository: UserRepository) {}

  async followUser(userId: string, targetUserId: string): Promise<boolean> {
    return this.repository.follow(userId, targetUserId)
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<boolean> {
    return this.repository.unfollow(userId, targetUserId)
  }

  async getFollowers(userId: string): Promise<FollowerDto[]> {
    const user = await this.userRepository.getById(userId)
    if(!user) throw new NotFoundException('User not found')
    return await this.repository.getFollowers(userId)
  }
}
