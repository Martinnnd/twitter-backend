import { FollowerDto } from '../dto'

export interface FollowerRepository {
  follow: (userId: string, targetUserId: string) => Promise<boolean>
  unfollow: (userId: string, targetUserId: string) => Promise<boolean>
  getByIds: (followerId: string, followedId: string) => Promise<FollowerDto | null>
  getFollowers: (userId: string) => Promise<FollowerDto[]>
  getFollows: (userId: string) => Promise<FollowerDto[]>
}
