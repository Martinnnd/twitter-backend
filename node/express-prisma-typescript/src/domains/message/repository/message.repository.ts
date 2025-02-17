import { MessageDto, MessageInputDto } from '../dto'

export interface MessageRepository {
  create: (data: MessageInputDto) => Promise<MessageDto>
  getChats: (userId: string) => Promise<MessageDto[]>
  getChat: (userId: string, to: string) => Promise<MessageDto[]>
}