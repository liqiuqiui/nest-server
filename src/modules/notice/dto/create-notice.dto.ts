import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ description: '公告内容' })
  @IsString()
  @Length(5, 2000)
  content: string;
  @ApiProperty({ description: '公告标题' })
  @IsString()
  @Length(2, 30)
  title: string;

  @ApiProperty({ description: '公告图片' })
  @IsUrl()
  image: string;

  @ApiPropertyOptional({ description: '是否焦点公告图' })
  @IsBoolean()
  @IsOptional()
  focus?: boolean;
}
