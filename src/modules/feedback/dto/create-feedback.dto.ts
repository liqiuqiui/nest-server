import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMobilePhone, IsString, IsUrl } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  name: string;

  @IsMobilePhone(
    'zh-CN',
    { strictMode: false },
    { message: '请输入有效的电话号码' },
  )
  phone: string;

  @IsString()
  desc: string;

  @ApiPropertyOptional({ description: '反馈图片' })
  @IsUrl({}, { each: true })
  images?: string[];
}
