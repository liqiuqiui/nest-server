import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map(file => ({ url: '/static/images/' + file.filename }));
  }
}
