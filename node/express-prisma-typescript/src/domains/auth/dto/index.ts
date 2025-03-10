import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class TokenDTO {
  token!: string
}

export class SignupInputDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
    email: string

  @IsString()
  @IsNotEmpty()
    username: string

  @IsString()
  @IsNotEmpty()
    name: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password: string

  constructor (email: string, username: string, password: string, name: string) {
    this.email = email
    this.password = password
    this.username = username
    this.name = name
  }
}

export class LoginInputDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
    username?: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password!: string
}
