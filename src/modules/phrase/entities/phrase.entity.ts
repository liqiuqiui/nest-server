import { Base } from '@/common/entities/base.entity';
import { Column, Entity, Unique } from 'typeorm';

@Unique(['text'])
@Entity()
export class Phrase extends Base {
  @Column({ comment: '短语内容' })
  text: string;

  @Column({ comment: '短语被引用的次数', default: 0 })
  refCount: number;
}
