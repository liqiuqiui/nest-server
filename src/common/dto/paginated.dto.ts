import { PaginationResDto } from './pagination-res.dto';

export class PaginatedDto<D> {
  list: D[];
  pagination: PaginationResDto;
}
