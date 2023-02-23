import { Base } from '@/common/entities/base.entity';
import { Feedback } from '@/modules/feedback/entities/feedback.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique('openid_idx', ['openid', 'id'])
export class User extends Base {
  @Column({ comment: '微信开放平台的openid', nullable: true })
  openid: string;

  @Column({ comment: '用户昵称', nullable: true })
  nickname: string;

  @Column({ comment: '用户头像', nullable: true })
  avatarUrl: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, comment: '用户手机号' })
  phone: string;

  @ApiProperty({ description: '仅管理员有效', nullable: true })
  @Column({ comment: '账户名(仅管理员)', nullable: true })
  username: string | null;

  @ApiProperty({ description: '仅管理员有效', nullable: true })
  @Column({ comment: '账户密码(仅管理员)', nullable: true })
  password: string | null;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, comment: '用户姓名' })
  name: string;

  @ApiProperty({ description: '0: 系统管理员, 1: 普通用户, 2: 维修工' })
  @Column({ default: 1, comment: '用户角色' })
  role: number;

  // @ApiProperty({ description: '学院编号（仅学生用户）', nullable: true })
  // @Column({ comment: '学院编号（仅学生用户）', nullable: true })
  // academyNo: string;

  @ApiProperty({ description: '学院名称（仅学生用户）', nullable: true })
  @Column({ comment: '学院名称（仅学生用户）', nullable: true })
  academyName: string;

  @ApiProperty({ description: '专业名称（仅学生用户）', nullable: true })
  @Column({ comment: '专业名称（仅学生用户）', nullable: true })
  majorName: string;
  @ApiProperty({ description: '专业编号（仅学生用户）', nullable: true })
  @Column({ comment: '专业编号（仅学生用户）', nullable: true })
  majorNo: string;

  @ApiProperty({ description: '班级编号（仅学生用户）', nullable: true })
  @Column({ comment: '班级编号（仅学生用户）', nullable: true })
  classNo: string;

  @ApiProperty({ description: '班级名称（仅学生用户）', nullable: true })
  @Column({ comment: '班级名称（仅学生用户）', nullable: true })
  className: string;

  @ApiProperty({ description: '学/工号（非管理员）', nullable: true })
  @Column({ comment: '学/工号（非管理员）', nullable: true })
  userNo: string;

  @ApiProperty({ description: '注册状态' })
  @Column({ comment: '注册状态', default: 0 })
  registerState: number;

  @OneToMany(() => Order, order => [order.user, order.repairman])
  orders: Order[];

  @ApiHideProperty()
  @OneToMany(() => Feedback, feedback => feedback.user)
  feedbacks?: Feedback[];
}
