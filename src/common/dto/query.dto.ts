import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeedbackState } from '../constants/feedback.constant';
import { OrderState } from '../constants/order.constant';

export class QueryDto {
  @ApiProperty({ description: '用户姓名' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: 'number',
    description:
      '按订单状态查询, 0: 未审核, 1: 审核通过, 2: 审核失败, 3: 已派单, 4: 已完成',
    enum: OrderState,
  })
  @IsEnum(OrderState)
  @IsOptional()
  orderState?: number;

  @ApiPropertyOptional({
    type: 'number',
    description: '按反馈状态查询, 0: 待处理, 1: 已处理',
    enum: FeedbackState,
  })
  @IsEnum(FeedbackState)
  @IsOptional()
  feedbackState?: FeedbackState;
}
