import { OrderState } from '@/common/constants/order.constant';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'mutex', async: false })
class Mutex implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    const obj = validationArguments.object as ProcessOrderDto;

    if (obj.state === OrderState.pass && value !== undefined) {
      return false;
    }

    if (
      obj.state === OrderState.fail &&
      (typeof value !== 'string' || value?.length < 1)
    )
      return false;

    return true;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const obj = validationArguments.object as ProcessOrderDto;

    if (obj.state === OrderState.pass && obj.reason !== undefined) {
      return `when state=${OrderState.pass}, the reason should not be provided`;
    }

    if (obj.state === OrderState.fail) {
      const reasonLen = String(obj.reason).length;
      if (typeof obj.reason !== 'string' || reasonLen < 1 || reasonLen > 255) {
        return 'reason should be a string between 1 and 255 in length';
      }
    }
  }
}

export class ProcessOrderDto {
  @ApiProperty({
    description: '新的订单状态, 1:通过, 2:拒绝',
    enum: [OrderState.pass, OrderState.fail],
  })
  @IsIn([OrderState.pass, OrderState.fail], {
    message: 'state must be number 1 or 2',
  })
  state: OrderState;

  @ApiProperty({ description: '审核失败原因, state为1时, reason不传' })
  @Validate(Mutex)
  reason?: string;
}
