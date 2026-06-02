import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class JoinDto {
  @IsEmail()
  username!: string

  @IsNotEmpty()
  @MinLength(8)
  password!: string

  @IsNotEmpty()
  @MinLength(2)
  role!: string
}
