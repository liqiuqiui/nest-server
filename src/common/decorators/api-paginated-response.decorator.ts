/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationResDto } from '../dto/pagination-res.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    // ApiExtraModels(PaginatedDto),
    ApiExtraModels(PaginationResDto),
    ApiOkResponse({
      // type: PaginatedDto<typeof model>,
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        required: ['code', 'message', 'data'],
        properties: {
          code: { type: 'number', default: 200 },
          message: { type: 'string', default: 'success' },
          data: {
            required: ['list', 'pagination'],
            properties: {
              list: {
                type: 'array',
                title: `${model.name}[]`,
                items: {
                  $ref: getSchemaPath(model),
                },
              },
              pagination: {
                title: 'PaginationResDto',
                $ref: getSchemaPath(PaginationResDto),
              },
            },
          },
        },
      },
    }),
  );
