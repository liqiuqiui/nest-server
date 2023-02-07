import { Base } from '@/common/entities/base.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique('openid_idx', ['openid'])
export class Repairman extends Base {
  @Column({ comment: '微信开放平台的openid' })
  openid: string;

  @Column({ comment: '用户昵称' })
  nickname: string;

  @Column({ comment: '用户头像' })
  avatarUrl: string;

  @Column({ nullable: true, comment: '用户手机号' })
  phone: string;

  @Column({ nullable: true, comment: '用户姓名' })
  name: string;

  @ApiProperty({ description: '0: 系统管理员, 1: 普通用户, 2: 维修工' })
  @Column({ default: 2, comment: '用户角色' })
  role: number;

  @ApiHideProperty()
  @OneToMany(() => Order, order => order.repairman, {
    createForeignKeyConstraints: false,
  })
  orders: Order[];
}
