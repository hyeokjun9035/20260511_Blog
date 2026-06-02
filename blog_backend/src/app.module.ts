import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { PostsModule } from './posts/posts.module'
import { UploadController } from './upload/upload.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule, AuthModule, PostsModule],
  controllers: [AppController, UploadController],
  providers: [AppService, CloudinaryService],
})
export class AppModule { }
