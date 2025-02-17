import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserService {
  getUser: (userId: any) => Promise<ExtendedUserDTO>
  getUserRecommendations: (userId: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  getUserView: (userId: string, loggedUser: string) => Promise<{ user: UserViewDTO, followsYou: boolean, following: boolean }>
  getUsersByUsername: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  deleteUser: (userId: any) => Promise<void>
  setProfilePicture (userId: string, filetype: string): Promise<{ presignedUrl: string, profilePictureUrl: string}>
  getProfilePicture (userId: string): Promise<string | null>
  getSelfUser( userId: string): Promise<UserViewDTO>
}
