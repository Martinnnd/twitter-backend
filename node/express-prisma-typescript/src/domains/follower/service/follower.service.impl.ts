import { FollowerService } from './follower.service'
import { FollowerRepository } from '../repository'
import { UserRepository } from '@domains/user/repository'
import { FollowerDto } from '../dto'
import { NotFoundException } from '@utils'
import { UserViewDTO } from '@domains/user/dto'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository, private readonly userRepository: UserRepository) {}

  async followUser(userId: string, targetUserId: string): Promise<FollowerDto> {
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

  async getFollowings(userId: string): Promise<FollowerDto[]> {
    const user = await this.userRepository.getById(userId)
    if(!user) throw new NotFoundException('User not found')
    return await this.repository.getFollowings(userId)
  }

  async getMutuals(userId: string): Promise<UserViewDTO[]> {
    const followers = await this.repository.getFollowers(userId)
    const followings = await this.repository.getFollowings(userId)
    const mutuals = followers.filter(follower => followings.find(following => following.followedId === follower.followerId))
    const users = await Promise.all(
      mutuals.map(async mutual => {
        const user = await this.userRepository.getById(mutual.followerId)
        if (user) return new UserViewDTO(user)
      })
    )
    return users.filter(user => user) as UserViewDTO[]
  }
}

