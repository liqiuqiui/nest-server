import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UserLoginDto {
  @IsString()
  code: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ description: '仅在测试时候使用' })
  @IsString()
  @IsOptional()
  openid?: string;
}
