import { Base } from '@/common/entities/base.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Address extends Base {
  @Column({ comment: '地址名称' })
  name: string;

  @Column({ comment: '地址层级' })
  level: number;

  @TreeParent({})
  parent: Address | null;

  @ApiPropertyOptional()
  @TreeChildren()
  children: Address[];

  @OneToMany(() => Order, order => order.address)
  order: Order[];
}
