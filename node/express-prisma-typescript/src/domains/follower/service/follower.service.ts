import { FollowerRepository } from "../repository/follower.repository";

export class FollowerService {
  private followerRepository: FollowerRepository;

  constructor() {
    this.followerRepository = new FollowerRepository();
  }

  async followUser(followerId: string, followedId: string) {
    return this.followerRepository.followUser(followerId, followedId);
  }

  async unfollowUser(followerId: string, followedId: string) {
    return this.followerRepository.unfollowUser(followerId, followedId);
  }
}
