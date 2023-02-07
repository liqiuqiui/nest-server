import { ApiBadRequestResponse as SwaggerApiBadRequestResponse } from '@nestjs/swagger';

export const ApiBadRequestResponse = () =>
  SwaggerApiBadRequestResponse({
    description: '参数异常',
    schema: {
      required: ['code', 'message', 'meta'],
      properties: {
        code: { type: 'number', default: 400 },
        message: { type: 'string', default: 'Bad Request' },
        data: { type: 'array', default: [] },
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
