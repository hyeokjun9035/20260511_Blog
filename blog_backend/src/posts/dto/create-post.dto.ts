import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  @IsInt()
  category_id!: number

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title!: string

  @IsNotEmpty()
  @IsString()
  contents!: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail?: string

  @IsOptional()
  @IsInt()
  author_id?: number

  @IsOptional()
  @IsBoolean()
  is_public?: boolean
}
