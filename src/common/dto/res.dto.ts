import { ApiHideProperty } from '@nestjs/swagger';

export class Res<D> {
  code: number;
  message: string;

  @ApiHideProperty()
  data: D;
}
