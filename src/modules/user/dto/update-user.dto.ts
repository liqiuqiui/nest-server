import { OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['openid']),
) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '手机号无效' })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
