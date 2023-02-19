import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Logger } from '../utils/logger';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.log(exception);

    return response.status(500).send({
      code: 500,
      message: 'Internal server error',
      data: exception.stack,
    });
  }
}
