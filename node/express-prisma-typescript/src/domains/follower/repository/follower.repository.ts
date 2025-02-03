export interface FollowerRepository {
  follow: (userId: string, targetUserId: string) => Promise<boolean>
  unfollow: (userId: string, targetUserId: string) => Promise<boolean>
}
