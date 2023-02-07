import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  pageSize?: number = 5;

  @IsOptional()
  @IsPositive()
  page?: number = 1;
}
