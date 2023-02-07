import { ApiUnauthorizedResponse as SwaggerApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiUnauthorizedResponse = () =>
  SwaggerApiUnauthorizedResponse({
    description: '身份验证失败',
    schema: {
      required: ['code', 'message', 'meta'],
      properties: {
        code: { type: 'number', default: 401 },
        message: { type: 'string', default: 'Unauthorized' },
        data: { type: 'string', default: 'Unauthorized' },
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
