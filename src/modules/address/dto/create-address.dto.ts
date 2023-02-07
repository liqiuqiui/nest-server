import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  name: string;

  @ApiProperty({ type: 'integer', description: '父级id' })
  @IsPositive()
  @IsOptional()
  parentId?: number;
}
