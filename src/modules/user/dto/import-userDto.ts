import { ApiProperty } from '@nestjs/swagger';

export class ImportUserDto {
  @ApiProperty({ type: 'file', description: '用户信息 excel表格' })
  excel: any;
}
