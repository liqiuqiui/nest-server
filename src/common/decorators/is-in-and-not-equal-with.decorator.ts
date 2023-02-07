import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

interface Condition {
  in: any[];
  notEqual: string;
  type: 'string' | 'number' | 'array' | 'object';
}
export function IsInAndNotEqualWith(
  condition: Condition,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isInAndNotEqualWith',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [condition],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [condition] = args.constraints as [Condition];
          const targetObject = args.object as any;
          console.log(
            value,
            condition,
            ['string', 'number'].includes(condition.type as string),
            typeof value !== condition.type,
            ['string', 'number'].includes(condition.type as string) &&
              typeof value !== condition.type,
          );

          // 类型校验
          if (
            (['string', 'number'].includes(condition.type) &&
              typeof value !== condition.type) ||
            (condition.type === 'array' && !(value instanceof Array)) ||
            (condition.type === 'object' && !(value instanceof Object)) ||
            !['string', 'number', 'array', 'object'].includes(condition.type)
          )
            return false;
          // else if (condition.type === 'array' && value instanceof Array) {
          //   return false;
          // } else return false;

          return (
            condition.in.includes(value) &&
            value != targetObject[condition.notEqual]
          );
        },
      },
    });
  };
}
