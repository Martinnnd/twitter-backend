import { UserViewDTO } from '@domains/user/dto'
import { FollowerDto } from '../dto'

export interface FollowerService {
  followUser: (userId: string, targetUserId: string) => Promise<boolean>
  unfollowUser: (userId: string, targetUserId: string) => Promise<boolean>
  getFollowers: (userId: string) => Promise<FollowerDto[]>
  getFollowings: (userId: string) => Promise<FollowerDto[]>
  getMutuals: (userId: string) => Promise<UserViewDTO[]>
}
