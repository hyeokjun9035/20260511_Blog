import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string

  @IsNotEmpty()
  @IsString()
  content: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string

  @IsOptional()
  @IsBoolean()
  published?: boolean
}
