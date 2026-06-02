import { IsBoolean, IsInt, IsOptional, IsString, MaxLength } from 'class-validator'

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
  @IsBoolean()
  is_public?: boolean
}
