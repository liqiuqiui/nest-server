import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class FinishOrderDto {
  @ApiProperty({ description: '图片url数组', isArray: true })
  @IsUrl({}, { each: true })
  finishImages: string[];

  @IsString()
  fixDesc: string;
}
