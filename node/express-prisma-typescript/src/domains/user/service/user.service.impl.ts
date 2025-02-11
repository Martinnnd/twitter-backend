import { NotFoundException } from '@utils/errors';
import { CursorPagination, OffsetPagination } from 'types';
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto';
import { UserRepository } from '../repository';
import { UserService } from './user.service';
import { Constants } from '@utils/constants';
import { generateS3UploadUrl } from '@utils/aws';
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

  async getUserView(userId: string, loggedUser: string): Promise<{ user: UserViewDTO, followsYou: boolean, following: boolean }> {
    const user = await this.repository.getById(userId)
    if(!user) throw new NotFoundException('user')
    const followsYou = await this.followerRepository.getByIds(userId, loggedUser)
    const following = await this.followerRepository.getByIds(loggedUser, userId)
    const userView = new UserViewDTO(user)
    return { user: userView, followsYou: followsYou != null, following: following != null }
  }

  async getUsersByUsername (username: string, options: CursorPagination): Promise<UserViewDTO[]> {
    const users = await this.repository.getByUsernamePaginated(username, options)
    return users.map((user) => new UserViewDTO(user))
  }

  async setProfilePicture (userId: string, filetype: string): Promise<{ presignedUrl: string, profilePictureUrl: string}> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    const data = await generateS3UploadUrl(filetype)
    const url = `https://${Constants.BUCKET_NAME}.s3.amazonaws.com/${data.filename}.jpeg`
    await this.repository.setProfilePicture(userId, url)
    return { presignedUrl: data.presignedUrl, profilePictureUrl: url }
  }

  async getProfilePicture (userId: string): Promise<string | null> {
    const url = await this.repository.getProfilePicture(userId)
    return url
  }

  async deleteUser(userId: any): Promise<void> {
    await this.repository.delete(userId);
  }
}
