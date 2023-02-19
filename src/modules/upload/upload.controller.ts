import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({
    summary: '上传图片，可多文件上传',
    operationId: 'uploadMedia',
  })
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map(file => ({ url: '/static/images/' + file.filename }));
  }
}
