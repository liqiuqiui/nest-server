import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Query,
  Patch,
  Put,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ParsePositiveIntPipe } from '@/common/pipe/parse-positive-int.pipe';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enum/role.enum';
import { Feedback } from './entities/feedback.entity';
import { QueryFeedbackDto } from './dto/query-feedback.dto';
import { ProcessFeedbackDto } from './dto/procecc-feedback.dto';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiPaginatedResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';

@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiTags('建议反馈')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Auth(Role.User, Role.Repairman)
  @ApiOperation({ summary: '创建一个建议反馈' })
  @ApiResponse(Feedback, HttpStatus.CREATED)
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Auth()
  @ApiPaginatedResponse(Feedback)
  @ApiOperation({ summary: '分页查询建议反馈' })
  @Get()
  findAll(@Query() queryFeedbackDto: QueryFeedbackDto) {
    return this.feedbackService.findAll(queryFeedbackDto);
  }

  @ApiOperation({ summary: '根据id查询建议反馈' })
  @ApiNotFoundResponse()
  @Get(':feedbackId')
  findOne(@Param('feedbackId', ParsePositiveIntPipe) id: number) {
    return this.feedbackService.findOne(id);
  }

  @ApiOperation({ summary: '处理建议反馈' })
  @ApiForbiddenResponse()
  @Auth(Role.Admin)
  @Put(':feedbackId')
  @Patch(':feedbackId')
  process(
    @Param('feedbackId', ParsePositiveIntPipe) id: number,
    @Body() processFeedbackDto: ProcessFeedbackDto,
  ) {
    return this.feedbackService.process(id, processFeedbackDto);
  }
}
