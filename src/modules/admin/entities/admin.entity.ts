import { Base } from '@/common/entities/base.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class Admin extends Base {
  @Column({ comment: '用户名' })
  username: string;

  @ApiHideProperty()
  @Column({ comment: '密码', select: false })
  password: string;

  @ApiProperty({ nullable: true })
  @Column({ comment: '邮箱', nullable: true })
  email: string;

  @ApiProperty({ nullable: true })
  @Column({ comment: '手机号', nullable: true })
  phone: string;

  @ApiProperty({ default: 0 })
  @Column({ comment: '角色', default: 0 })
  role: number;

  @ApiProperty({ nullable: true })
  @Column({ comment: '管理员头像', nullable: true })
  avatar: string;
}
