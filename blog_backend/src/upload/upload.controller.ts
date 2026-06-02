import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

import { AuthGuard } from '@nestjs/passport';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async uploadImage(
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        const result: any =
            await this.cloudinaryService.uploadImage(
                file,
            );

        return {
            imageUrl: result.secure_url,
        };
    }
}