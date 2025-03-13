import { NotFoundException } from '@utils/errors';
import { MessageDto } from '../dto';
import { MessageRepository } from '../repository';
import { MessageService } from './message.service';
import { FollowerRepository } from '@domains/follower/repository';
import { UserRepository } from '@domains/user/repository';
import { UserViewDTO } from '@domains/user/dto';

export class MessageServiceImpl implements MessageService {
  constructor(
    private readonly repository: MessageRepository,
    private readonly followerRepository: FollowerRepository,
    private readonly userRepository: UserRepository
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<MessageDto> {
    if (senderId === receiverId) {
      throw new NotFoundException('You cannot send a message to yourself');
    }

    const [sender, receiver, follows] = await Promise.all([
      this.userRepository.getById(senderId),
      this.userRepository.getById(receiverId),
      this.followerRepository.getByIds(senderId, receiverId)
    ]);

    if (!sender || !receiver) throw new NotFoundException('User not found');
    if (!follows) throw new NotFoundException('Users are not following each other');

    return await this.repository.create({ content, from: senderId, to: receiverId });
  }

  async getAllChats(userId: string): Promise<UserViewDTO[]> {
    const chatUsers = await this.repository.getChats(userId);
    const users = await Promise.all(
      chatUsers.map(async (chat) => {
        const user = await this.userRepository.getById(chat.from === userId ? chat.to : chat.from);
        return user ? new UserViewDTO(user) : null;
      })
    );
    return users.filter(Boolean) as UserViewDTO[];
  }

  async getConversation(userId: string, otherUserId: string): Promise<MessageDto[]> {
    const receiver = await this.userRepository.getById(otherUserId);
    if (!receiver) throw new NotFoundException('User not found');
    return await this.repository.getChat(userId, otherUserId);
  }

  async canSendMessage(senderId: string, receiverId: string): Promise<boolean> {
    if (senderId === receiverId) {
      return false;
    }

    const [sender, receiver, follows] = await Promise.all([
      this.userRepository.getById(senderId),
      this.userRepository.getById(receiverId),
      this.followerRepository.getByIds(senderId, receiverId)
    ]);

    if (!sender || !receiver) return false;
    return !!follows;
  }
}
