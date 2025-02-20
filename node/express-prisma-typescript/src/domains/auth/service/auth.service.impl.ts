import { UserRepository } from '@domains/user/repository'
import {
  checkPassword,
  ConflictException,
  Constants,
  encryptPassword,
  generateAccessToken,
  NotFoundException,
  UnauthorizedException
} from '@utils'
import jwt from 'jsonwebtoken'
import { LoginInputDTO, SignupInputDTO, TokenDTO } from '../dto'
import { AuthService } from './auth.service'

export class AuthServiceImpl implements AuthService {
  constructor (private readonly repository: UserRepository) {}

  async signup (data: SignupInputDTO): Promise<{ userId: string, token:string }> {
    const existingUser = await this.repository.getByEmailOrUsername(data.email, data.username)
    if (existingUser) throw new ConflictException('User already exists')

    const encryptedPassword = await encryptPassword(data.password)

    const user = await this.repository.create({ ...data, password: encryptedPassword })
    const token = generateAccessToken({ userId: user.id })

    return { userId: user.id, token }
  }

  async login (data: LoginInputDTO): Promise<{ userId: string, token: string }> {
    const user = await this.repository.getByEmailOrUsername(data.email, data.username)
    if (!user) throw new NotFoundException('user')

    const isCorrectPassword = await checkPassword(data.password, user.password)

    if (!isCorrectPassword) throw new UnauthorizedException('Invalid credentials')

    const token = generateAccessToken({ userId: user.id })

    return { userId: user.id, token }
  }

  validateToken (token: string): { validToken: boolean } {
    try {
      jwt.verify(token, Constants.TOKEN_SECRET)
      return { validToken: true }
    } catch (error) {
      return { validToken: false }
    }
  }
}
