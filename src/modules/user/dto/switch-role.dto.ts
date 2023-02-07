import { IsInAndNotEqualWith } from '@/common/decorators/is-in-and-not-equal-with.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SwitchRoleDto {
  @ApiProperty({ description: '账户id' })
  @IsString()
  openid: string;

  @ApiProperty({ description: '1: 普通用户, 2: 维修工' })
  @IsInAndNotEqualWith(
    { in: [1, 2], type: 'number', notEqual: 'toRole' },
    { message: 'fromRole must be 1 or 2 and not equal toRole' },
  )
  fromRole: number;

  @ApiProperty({ description: '1: 普通用户, 2: 维修工' })
  @IsInAndNotEqualWith(
    { in: [1, 2], type: 'number', notEqual: 'fromRole' },
    { message: 'toRole must be 1 or 2 and not equal fromRole' },
  )
  toRole: number;
}
