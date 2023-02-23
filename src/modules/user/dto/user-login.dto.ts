import { IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  code: string;
}
