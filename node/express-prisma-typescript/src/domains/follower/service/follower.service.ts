export interface FollowerService {
  followUser: (userId: string, targetUserId: string) => Promise<boolean>
  unfollowUser: (userId: string, targetUserId: string) => Promise<boolean>
}
