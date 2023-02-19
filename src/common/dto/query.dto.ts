import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsMobilePhone,
  isNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { FeedbackState } from '../constants/feedback.constant';
import { OrderState, UrgentLevel } from '../constants/order.constant';
import { Role } from '../enum/role.enum';

export class QueryDto {
  @ApiProperty({ description: '用户姓名模糊查询' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '用户昵称模糊查询' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: '用户手机号模糊查询' })
  @IsInt()
  @IsOptional()
  phone?: number;

  @ApiPropertyOptional({ description: '按用户角色筛选' })
  @IsIn([Role.Repairman, Role.User])
  @IsOptional()
  role?: number;

  @ApiPropertyOptional({ description: '是否查询用户相关的订单' })
  @IsBoolean()
  @IsOptional()
  relateOrder?: boolean;

  @ApiPropertyOptional({
    description: '按紧急状态查询, 0: 一般, 1: 严重, 2: 紧急',
  })
  @IsEnum(UrgentLevel)
  @IsOptional()
  urgentLevel?: number;

  @ApiPropertyOptional({
    type: 'number',
    description:
      '按订单状态查询, -1: 全部, 0: 未审核, 1: 审核通过, 2: 审核失败, 3: 已派单, 4: 已完成',
    enum: [-1, 0, 1, 2, 3, 4],
  })
  @IsEnum(OrderState)
  @IsOptional()
  state?: number;

  @ApiPropertyOptional({ description: '订单号模糊查询' })
  @IsString()
  @IsOptional()
  orderNo: string;

  @ApiPropertyOptional({ description: '起始时间' })
  @IsDate()
  @IsOptional()
  startTime?: Date;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsDate()
  @IsOptional()
  endTime?: Date;

  @ApiPropertyOptional({
    type: 'number',
    description: '按反馈状态查询, 0: 待处理, 1: 已处理',
    enum: FeedbackState,
  })
  @IsEnum(FeedbackState)
  @IsOptional()
  feedbackState?: FeedbackState;

  @ApiPropertyOptional({
    description: '按描述筛选',
  })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiPropertyOptional({
    description: '是否查询已删除的数据',
    default: 0,
  })
  @IsIn([0, 1])
  @IsOptional()
  withDeleted?: number = 0;

  @ApiPropertyOptional({
    description: '父级id',
    type: 'integer',
  })
  @IsPositive()
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiPropertyOptional({ description: '层级' })
  @IsIn([1, 2, 3])
  @IsOptional()
  level?: number;
}
