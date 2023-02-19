import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { QueryDto } from '@/common/dto/query.dto';
import { IntersectionType, PickType } from '@nestjs/swagger';

export class QueryUserDto extends IntersectionType(
  PaginationQueryDto,
  PickType(QueryDto, [
    'name',
    'role',
    'state',
    'relateOrder',
    'endTime',
    'startTime',
    'nickname',
    'phone',
  ]),
) {}
