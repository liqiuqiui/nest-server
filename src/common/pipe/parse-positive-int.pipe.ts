import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: number, metadata: ArgumentMetadata) {
    if (isNaN(value) || value < 1)
      throw new BadRequestException(
        `the ${metadata.type}[${metadata.data}] must be a positive numeric string`,
      );
    return value;
  }
}
