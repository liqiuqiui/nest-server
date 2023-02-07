import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class AssignOrderDto {
  @ApiProperty({ description: '维修工id', type: 'integer' })
  @IsPositive()
  repairmanId: number;
}
