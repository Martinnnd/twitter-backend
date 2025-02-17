import { UserViewDTO } from '@domains/user/dto'
import { MessageDto } from '../dto'

export interface MessageService {
  sendMessage(senderId: string, receiverId: string, content: string): Promise<MessageDto>
  getAllChats(userId: string): Promise<UserViewDTO[]>
  getConversation(userId: string, otherUserId: string): Promise<MessageDto[]>
}