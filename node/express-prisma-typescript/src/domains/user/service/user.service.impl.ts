import { NotFoundException } from '@utils/errors';
import { OffsetPagination } from 'types';
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto';
import { UserRepository } from '../repository';
import { UserService } from './user.service';
import { FollowerRepository } from '@domains/follower/repository';

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository, private readonly followerRepository: FollowerRepository) {}

  async getUser(userId: any): Promise<ExtendedUserDTO> {
    const user = await this.repository.getById(userId);
    if (!user) throw new NotFoundException('user');
    return user;
  }

  async getUserRecommendations(userId: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.repository.getRecommendedUsersPaginated(userId, options);
    const filterPromises = users.map(async (user) => {
      const following = await this.followerRepository.getByIds(userId, user.id);
      return following ? false : true;
    });
    const filterResults = await Promise.all(filterPromises);
    const filteredUsers = users.filter((_, index) => filterResults[index]);
    return filteredUsers.map((user) => new UserViewDTO(user));
  }

  async deleteUser(userId: any): Promise<void> {
    await this.repository.delete(userId);
  }
}
