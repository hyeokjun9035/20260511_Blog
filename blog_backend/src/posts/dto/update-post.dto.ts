import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string

  @IsOptional()
  @IsBoolean()
  published?: boolean
}
