import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Role } from '../enum/role.enum';

@Injectable()
export class ParseRolePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isNaN(value) || ![Role.Repairman, Role.User].includes(value))
      throw new BadRequestException(
        `the ${metadata.type}[${metadata.data}] must be one of 1 or 2`,
      );
    return value;
  }
}
