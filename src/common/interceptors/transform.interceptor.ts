import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = next.handle();
    const response = context.switchToHttp().getResponse<Response>();

    return handler.pipe(
      map(data => {
        return {
          code: response.statusCode,
          message: 'success',
          data: data,
        };
      }),
    );
  }
}
