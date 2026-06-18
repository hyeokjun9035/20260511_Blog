import { IsBoolean, IsIn, IsInt, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string

  @IsOptional()
  @IsString()
  contents?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail?: string

  @IsOptional()
  @IsInt()
  author_id?: number

  @IsOptional()
  @IsString()
  @IsIn(['DRAFT', 'PUBLISHED', 'PRIVATE', 'DELETED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'DELETED'
}
