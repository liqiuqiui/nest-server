import { ApiHideProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createdTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updatedTime: Date;

  @DeleteDateColumn({
    comment: '删除时间',
  })
  deletedTime: Date;
}
