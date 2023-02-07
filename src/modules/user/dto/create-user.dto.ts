import { IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsUrl()
  avatarUrl: string;

  @IsString()
  nickname: string;

  @IsString()
  @Length(28, 28)
  openid: string;
}
