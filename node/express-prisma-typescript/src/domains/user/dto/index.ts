export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
    this.isPrivate = user.isPrivate
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string | null
  createdAt: Date
  isPrivate: boolean
  profilePicture: string | null
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.name = user.name
    this.username = user.username
    this.password = user.password
    this.isPrivate = user.isPrivate
  }

  email!: string
  username!: string
  password!: string
}
export class UserViewDTO {
  constructor (user: UserViewDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
    this.isPrivate = user.isPrivate
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
  isPrivate: boolean
}
