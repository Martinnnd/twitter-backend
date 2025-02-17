import { PrismaClient } from '@prisma/client';
import { MessageDto, MessageInputDto } from '../dto';
import { MessageRepository } from './message.repository';

export class MessageRepositoryImpl implements MessageRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: MessageInputDto): Promise<MessageDto> {
    try {
      const message = await this.db.message.create({ data });
      return new MessageDto(message);
    } catch (error) {
      throw new Error('Error creating message');
    }
  }

  async getChats(userId: string): Promise<MessageDto[]> {
    try {
      const messages = await this.db.message.findMany({
        where: {
          OR: [
            { from: userId },
            { to: userId }
          ]
        },
        orderBy: { createdAt: 'desc' },
        distinct: ['from', 'to']
      });
      return messages.map((message) => new MessageDto(message));
    } catch (error) {
      throw new Error('Error retrieving chats');
    }
  }

  async getChat(userId: string, to: string): Promise<MessageDto[]> {
    try {
      const messages = await this.db.message.findMany({
        where: {
          OR: [
            { from: userId, to },
            { from: to, to: userId }
          ]
        },
        orderBy: { createdAt: 'asc' }
      });
      return messages.map((message) => new MessageDto(message));
    } catch (error) {
      throw new Error('Error retrieving chat messages');
    }
  }
}
