import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from '../utils/logger';

type ErrorResult = {
  code?: number;
  message?: unknown;
  data?: object;
  meta: {
    [k: string]: unknown;
  };
};

type Exception = {
  statusCode: number;
  message: object;
  error: string;
};

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.log(exception);

    const status = exception.getStatus ? exception.getStatus() : 500;

    const exceptionResponse = exception.getResponse() as Exception;
    const result: ErrorResult = {
      code: status,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.error
          ? exceptionResponse.error
          : exceptionResponse.message,
      data: exceptionResponse.message,
      meta: {
        method: request.method,
        path: request.path,
        params: request.params,
        query: request.query,
        body: request.body,
      },
    };
    response.status(status).send(result);
  }
}
