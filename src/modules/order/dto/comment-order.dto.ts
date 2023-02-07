import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CommentOrderDto {
  @IsString()
  @Length(1, 4000)
  comment: string;

  @ApiProperty({ type: 'integer' })
  @IsInt()
  @Max(5)
  @Min(1)
  star: number;
}
