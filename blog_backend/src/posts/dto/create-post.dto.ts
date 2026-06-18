import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

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
  @MaxLength(500)
  thumbnail?: string

  @IsNotEmpty()
  @IsInt()
  author_id!: number

  @IsOptional()
  @IsString()
  @IsIn(['DRAFT', 'PUBLISHED', 'PRIVATE', 'DELETED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'DELETED'
}
