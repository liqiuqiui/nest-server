import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { QueryDto } from '@/common/dto/query.dto';
import { IntersectionType } from '@nestjs/swagger';

export class QueryOrderDto extends IntersectionType(
  PaginationQueryDto,
  QueryDto,
) {}
