import { ApiForbiddenResponse as SwaggerApiForbiddenResponse } from '@nestjs/swagger';

export const ApiForbiddenResponse = () =>
  SwaggerApiForbiddenResponse({
    description: '无访问权限',
    schema: {
      required: ['code', 'message', 'meta'],
      properties: {
        code: { type: 'number', default: 403 },
        message: { type: 'string', default: 'Forbidden' },
        data: { type: 'string', default: 'Forbidden resource' },
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
