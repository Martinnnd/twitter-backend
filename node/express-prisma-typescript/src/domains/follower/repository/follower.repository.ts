import { UserViewDTO } from '@domains/user/dto'
import { FollowerDto } from '../dto'

export interface FollowerRepository {
  follow: (userId: string, targetUserId: string) => Promise<FollowerDto>
  unfollow: (userId: string, targetUserId: string) => Promise<boolean>
  getByIds: (followerId: string, followedId: string) => Promise<FollowerDto | null>
  getFollowers: (userId: string) => Promise<FollowerDto[]>
  getFollowings: (userId: string) => Promise<FollowerDto[]>
}
