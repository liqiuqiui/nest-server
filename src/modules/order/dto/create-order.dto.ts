import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  name: string;

  @IsMobilePhone(
    'zh-CN',
    { strictMode: false },
    { message: '请输入有效的电话号码' },
  )
  phone: string;

  @ApiProperty({ description: '故障描述' })
  @IsString()
  readonly desc: string;

  @ApiProperty({ description: '报修地址' })
  @IsString()
  readonly address: string;

  @ApiProperty({ description: '维修的紧急等级' })
  @IsNumber()
  @IsOptional()
  readonly urgentLevel?: number;

  @ApiProperty({ description: '期待维修时间' })
  @IsDate()
  readonly expectTime: Date;

  @ApiPropertyOptional({ description: '故障图片' })
  @IsUrl({}, { each: true })
  readonly faultImages?: string[];
}
