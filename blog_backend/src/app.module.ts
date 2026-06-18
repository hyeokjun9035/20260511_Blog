import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { PostsModule } from './posts/posts.module'
import { UploadController } from './upload/upload.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule, AuthModule, PostsModule, CategoryModule],
  controllers: [AppController, UploadController, CategoryController],
  providers: [AppService, CloudinaryService, CategoryService],
})
export class AppModule { }
