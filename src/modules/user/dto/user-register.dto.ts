import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';
import { UserLoginDto } from './user-login.dto';

export class UserRegisterDto extends UserLoginDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userNo?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nickname?: string;
}
