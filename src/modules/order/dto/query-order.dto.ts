import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { QueryDto } from '@/common/dto/query.dto';
import { IntersectionType, PickType } from '@nestjs/swagger';

export class QueryOrderDto extends IntersectionType(
  PaginationQueryDto,
  PickType(QueryDto, [
    'orderNo',
    'state',
    'name',
    'startTime',
    'endTime',
    'urgentLevel',
  ]),
) {}
