import { Base } from '@/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Notice extends Base {
  @Column({ comment: '公告标题' })
  title: string;
  @Column({ type: 'text', comment: '公告内容' })
  content: string;

  @Column({ comment: '公告图片' })
  image: string;

  @Column({ comment: '是否焦点公告', default: false })
  focus: boolean;
}
