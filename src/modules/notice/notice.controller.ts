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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '@/common/pipe/parse-positive-int.pipe';
import { Role } from '@/common/enum/role.enum';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Notice } from './entities/notice.entity';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiPaginatedResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';
import { QueryNoticeDto } from './dto/qeury-notice.dto';

@ApiTags('notice')
@ApiUnauthorizedResponse()
@ApiBearerAuth()
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({ summary: '发布公告', operationId: 'createNotice' })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiResponse(Notice, HttpStatus.CREATED)
  @Auth(Role.Admin)
  @Post()
  create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticeService.create(createNoticeDto);
  }

  @ApiOperation({ summary: '查询所有公告', operationId: 'getAllNotice' })
  @ApiPaginatedResponse(Notice)
  // @Auth()
  @Get()
  findAll(@Query() queryNoticeDto: QueryNoticeDto) {
    return this.noticeService.findAll(queryNoticeDto);
  }

  @ApiOperation({ summary: '根据id查询公告', operationId: 'getNoticeById' })
  @ApiResponse(Notice)
  @Auth()
  @Get(':id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.noticeService.findOne(id);
  }

  @ApiOperation({ summary: '根据id更新公告', operationId: 'updateNoticeById' })
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

  @ApiOperation({ summary: '根据id删除公告', operationId: 'deleteNoticeById' })
  @ApiResponse(Notice)
  @ApiForbiddenResponse()
  @Auth(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.noticeService.remove(id);
  }

  @ApiOperation({
    summary: '根据id恢复被删除的删除公告',
    operationId: 'recoverNoticeById',
  })
  @ApiResponse(Notice)
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Auth(Role.Admin)
  @Patch('/recover/:id')
  recover(@Param('id') id: number) {
    return this.noticeService.recover(id);
  }
}
