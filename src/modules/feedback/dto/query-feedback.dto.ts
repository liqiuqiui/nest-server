import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { QueryDto } from '@/common/dto/query.dto';
import { IntersectionType, PickType } from '@nestjs/swagger';

export class QueryFeedbackDto extends IntersectionType(
  PaginationQueryDto,
  PickType(QueryDto, ['feedbackState']),
) {}
