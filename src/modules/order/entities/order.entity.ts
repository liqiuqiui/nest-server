import { Base } from '@/common/entities/base.entity';
import { Image } from '@/common/entities/image.entity';
import { Repairman } from '@/modules/repairman/entities/repairman.entity';
import { User } from '@/modules/user/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Generated, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Order extends Base {
  @Generated('uuid')
  @Column({ type: 'uuid', comment: '订单号' })
  orderNo: string;

  @Column({ comment: '报修人姓名' })
  name: string;

  @Column({ comment: '报修人电话' })
  phone: string;

  @Column({ comment: '报修描述' })
  desc: string;

  @Column({ comment: '报修地址' })
  address: string;

  @Column({ type: 'tinyint', comment: '紧急等级', default: 0 })
  urgentLevel: number;

  @Column({ comment: '订单状态,0:未审核、1:审核通过、2:审核失败', default: 0 })
  state: number;

  @ApiProperty({ nullable: true })
  @Column({ comment: '审核失败原因, state为2时有效', nullable: true })
  reason: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'nvarchar', comment: '订单评价', nullable: true })
  comment: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'tinyint', comment: '评价打星', nullable: true })
  star: number;

  @Column({ type: 'timestamp', comment: '期待维修时间' })
  expectTime: Date;

  @Column({ type: 'timestamp', comment: '维修时间', nullable: true })
  fixTime: Date;

  @ApiProperty({ nullable: true })
  @Column({ comment: '维修描述', nullable: true })
  fixDesc: string;

  @ApiPropertyOptional()
  @OneToMany(() => Image, image => image.order, { cascade: true })
  faultImages: Image[];

  @ApiPropertyOptional()
  @OneToMany(() => Image, image => image.order, { cascade: true })
  finishImages: Image[];

  @ApiPropertyOptional()
  @ManyToOne(() => Repairman, repairman => repairman.orders, {
    createForeignKeyConstraints: false,
  })
  repairman: Repairman;

  @ApiPropertyOptional()
  @ManyToOne(() => User, user => user.orders, {
    createForeignKeyConstraints: false,
  })
  user: User;
}
