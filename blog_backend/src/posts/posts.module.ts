import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
