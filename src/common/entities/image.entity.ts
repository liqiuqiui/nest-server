import { Base } from '@/common/entities/base.entity';
import { Feedback } from '@/modules/feedback/entities/feedback.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from '../../modules/order/entities/order.entity';

@Entity()
export class Image extends Base {
  @Column({ comment: '图片url' })
  url: string;

  @Column({ comment: '图片类型, 0: 维修前, 1: 维修后, 2: 反馈图片' })
  type: number;

  @ApiHideProperty()
  @ManyToOne(() => Order, order => [order.finishImages, order.faultImages], {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  order: Order;

  @ApiHideProperty()
  @ManyToOne(() => Feedback, feedback => feedback.images, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  feedback: Feedback;
}
