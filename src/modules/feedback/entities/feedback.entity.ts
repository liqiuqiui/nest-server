import { Base } from '@/common/entities/base.entity';
import { Image } from '@/common/entities/image.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Feedback extends Base {
  @Column({ comment: '反馈人姓名' })
  name: string;

  @Column({ comment: '反馈人电话' })
  phone: string;
  @Column({ comment: '反馈描述' })
  desc: string;

  @Column({ comment: '反馈状态, 0: 待处理, 1: 已处理', default: 0 })
  state: number;

  @Column({ comment: '回复', nullable: true })
  reply: string;

  @OneToMany(() => Image, image => image.feedback, { cascade: true })
  images: Image[];

  @ManyToOne(() => User, user => user.feedbacks, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  user: User;
}

