import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  getSchemaPath,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

export const ApiResponse = <TModel extends Type<any>>(
  model: TModel,
  status: HttpStatus = HttpStatus.OK,
) =>
  applyDecorators(
    ApiExtraModels(model),
    SwaggerApiResponse({
      status: status,
      schema: {
        title: `ResponseOf${model.name}`,
        required: ['code', 'message', 'data'],
        properties: {
          code: { type: 'number', default: status },
          message: { type: 'string', default: 'success' },
          data: {
            $ref: getSchemaPath(model),
          },
        },
      },
    }),
  );

export const ApiResponseArray = <TModel extends Type<any>>(
  model: TModel,
  status: HttpStatus = HttpStatus.OK,
) =>
  applyDecorators(
    ApiExtraModels(model),
    SwaggerApiResponse({
      status: status,
      schema: {
        title: `ResponseOf${model.name}`,
        required: ['code', 'message', 'data'],
        properties: {
          code: { type: 'number', default: status },
          message: { type: 'string', default: 'success' },
          data: {
            type: 'array',
            title: `${model.name}[]`,
            items: {
              $ref: getSchemaPath(model),
            },
          },
        },
      },
    }),
  );
