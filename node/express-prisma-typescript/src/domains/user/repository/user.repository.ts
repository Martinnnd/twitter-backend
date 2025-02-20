import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  getById: (userId: string) => Promise<ExtendedUserDTO | null>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (userId: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  getByUsernamePaginated(username: string, options: OffsetPagination): Promise<UserViewDTO[] | { message: string }>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  setProfilePicture(userId: string, profilePicture: string): Promise<void>
  getProfilePicture(userId: string): Promise<string | null>
  setPrivate (userId: string, isPrivate: boolean): Promise<boolean>
}
