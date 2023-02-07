import { ApiNotFoundResponse as SwaggerApiNotFoundResponse } from '@nestjs/swagger';
export const ApiNotFoundResponse = (message?: string) =>
  SwaggerApiNotFoundResponse({
    description: '找不到资源',
    schema: {
      required: ['code', 'message', 'meta'],
      properties: {
        code: { type: 'number', default: 404 },
        message: { type: 'string', default: 'Not Found' },
        data: { type: 'string', default: message },
        meta: {
          required: ['method', 'path'],
          properties: {
            method: { type: 'string' },
            path: { type: 'string' },
            params: { type: 'object' },
            query: { type: 'object' },
            body: { type: 'object' },
          },
        },
      },
    },
  });
