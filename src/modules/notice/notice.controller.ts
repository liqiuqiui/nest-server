import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '@/common/pipe/parse-positive-int.pipe';
import { Role } from '@/common/enum/role.enum';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Notice } from './entities/notice.entity';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiPaginatedResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';

@ApiTags('公告')
@ApiUnauthorizedResponse()
@ApiBearerAuth()
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiResponse(Notice, HttpStatus.CREATED)
  @Auth(Role.Admin)
  @Post()
  create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticeService.create(createNoticeDto);
  }

  @ApiPaginatedResponse(Notice)
  // @Auth()
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.noticeService.findAll(paginationQueryDto);
  }

  @Get('test')
  test() {
    return this.noticeService.test();
  }

  @ApiResponse(Notice)
  @Auth()
  @Get(':id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.noticeService.findOne(id);
  }

  @ApiResponse(Notice)
  @ApiForbiddenResponse()
  @Patch(':id')
  @Put(':id')
  @Auth(Role.Admin)
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    return this.noticeService.update(id, updateNoticeDto);
  }

  @ApiResponse(Notice)
  @ApiForbiddenResponse()
  @Auth(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.noticeService.remove(id);
  }
}
