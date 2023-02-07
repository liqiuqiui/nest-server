import { Base } from '@/common/entities/base.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';

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
}
