import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: any): Promise<UserViewDTO> {
    // const user = await this.repository.getById(userId)
    // if (!user) throw new NotFoundException('user')
    // return user
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
      const userView = new UserViewDTO({
        id: user.id,
        name: user.name || '',  
        username: user.username || '',  
        profilePicture: user.profilePicture || ''  
      })
    return userView
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    // return await this.repository.getRecommendedUsersPaginated(options)
    const users = await this.repository.getRecommendedUsersPaginated(options)
    return users.map(user => new UserViewDTO({
      id: user.id,
      name: user.name || '',
      username: user.username || '',
      profilePicture: user.profilePicture || ''
    })) 
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }
}
